import { Redis } from "ioredis";
import crypto from "crypto";

interface GalleryItem {
	sessionId: string;
	version: string;
	title: string;
	description: string;
	upvotes?: string[]; // Array of IP addresses that have upvoted
	createdAt: string; // ISO date string
}

function hashIP(ip: string): string {
	return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 8);
}

export async function isIPBlocked(ip: string): Promise<boolean> {
	const blockedIPs = await getBlockedIPs();
	return blockedIPs.includes(ip);
}

export function getStorageKey(sessionId: string, version: string, ip?: string): string {
	if (!ip) {
		return `${sessionId}/${version}/*`;
	}
	const ipHash = hashIP(ip);
	return `${sessionId}/${version}/${ipHash}`;
}

function getGalleryKey(timestamp: number, randomHash: string, ip: string): string {
	const ipHash = hashIP(ip);
	return `gallery_${timestamp}_${randomHash}_${ipHash}`;
}

export async function saveToStorage(key: string, value: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	await redis.set(key, value);
}

export async function getFromStorage(key: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const value = await redis.get(key);
	return value;
}

export async function getFromStorageWithRegex(key: string): Promise<{value: string, key: string}> {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const keys = await redis.keys(key);
	if(keys.length === 0) {
		throw new Error("Not found");
	}
	
	return {value: await getFromStorage(keys[0]), key: keys[0]};
}

export async function getGalleryKeys(): Promise<string[]> {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const keys: string[] = [];
	let cursor = 0;
	const count = 10000;
	let batch = [];
	do {
		const resp = await redis.scan(cursor, "MATCH", "gallery_*", "COUNT", count);
		batch = resp[1];
		cursor += count;
		keys.push(...batch);
	} while (batch.length > 0);

	return keys.sort().reverse(); // Sort in descending order to get latest first
}

export async function getBlockedIPs(): Promise<string[]> {
	const blockedIPsStr = await getFromStorage("blocked_ips");
	return blockedIPsStr ? JSON.parse(blockedIPsStr) : [];
}

export async function blockIP(ip: string, token: string) {
	if (token !== process.env.BLOCK_SECRET) {
		throw new Error("Invalid token");
	}

	const blockedIPs = await getBlockedIPs();
	if (!blockedIPs.includes(ip)) {
		blockedIPs.push(ip);
		await saveToStorage("blocked_ips", JSON.stringify(blockedIPs));
	}

	const ipHash = hashIP(ip);
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	
	// Remove gallery items with this IP hash
	const galleryKeys = await redis.keys(`gallery_*_${ipHash}`);
	for (const key of galleryKeys) {
		await redis.del(key);
	}

	// Remove stored apps with this IP hash
	const appKeys = await redis.keys(`*/${ipHash}`);
	for (const key of appKeys) {
		await redis.del(key);
	}
}

// Cache for gallery items
let galleryCache: {
	items: GalleryItem[];
	lastFetch: number;
} | null = null;

export async function getGallery(): Promise<GalleryItem[]> {
	const now = Date.now();
	const CACHE_TTL = 30 * 1000; // 30 seconds in milliseconds

	// Return cached data if it's still fresh
	if (galleryCache && (now - galleryCache.lastFetch) < CACHE_TTL) {
		return galleryCache.items;
	}

	const keys = await getGalleryKeys();
	if(keys.length === 0) {
		return [];
	}

	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const itemStrings = await redis.mget(...keys);
	
	const items = itemStrings
		.filter((str): str is string => str !== null)
		.map((str) => {
			try {
				return JSON.parse(str) as GalleryItem;
			} catch (err) {
				console.error("Error parsing gallery item:", err);
				return null;
			}
		})
		.filter((item): item is GalleryItem => item !== null);

	// Update cache
	galleryCache = {
		items,
		lastFetch: now
	};

	return items;
}

export async function addToGallery(item: GalleryItem, creatorIP: string): Promise<boolean> {
	
	// Initialize upvotes array and ensure createdAt is set
	item.upvotes = [];
	item.createdAt = item.createdAt || new Date().toISOString();
	
	// Generate unique key with timestamp and random hash
	const timestamp = Math.floor(Date.now() / 1000);
	const randomHash = Math.random().toString(36).substring(2, 8);
	const key = getGalleryKey(timestamp, randomHash, creatorIP);
	
	await saveToStorage(key, JSON.stringify(item));

	return true;
}

export async function removeGalleryItem(sessionId: string, version: string, requestIP: string): Promise<boolean> {
	const ipHash = hashIP(requestIP);
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	
	// Look for items with matching sessionId/version and IP hash
	const keys = await redis.keys(`gallery_*_${ipHash}`);
	if(keys.length === 0) {
		throw new Error("Unauthorized: You can only remove your own submissions");
	}
	
	const itemStrings = await redis.mget(...keys);
	for (let i = 0; i < keys.length; i++) {
		const itemStr = itemStrings[i];
		if (itemStr) {
			try {
				const item = JSON.parse(itemStr);
				if (item.sessionId === sessionId && item.version === version) {
					await redis.del(keys[i]);
					return true;
				}
			} catch (err) {
				console.error("Error parsing gallery item:", err);
			}
		}
	}
	
	throw new Error("Unauthorized: You can only remove your own submissions");
}

export async function upvoteGalleryItem(sessionId: string, version: string, voterIp: string): Promise<number> {
	const { value: itemStr } = await getFromStorageWithRegex(getStorageKey(sessionId, version));
	if (!itemStr) throw new Error("App not found");

	const item = JSON.parse(itemStr);
	const creatorIpHash = hashIP(item.creatorIP);

	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const keys = await redis.keys("gallery_*_" + creatorIpHash);
	const galleryItems = await redis.mget(...keys);

	let galleryItem, galleryItemKey;
	for (let i = 0; i < galleryItems.length; i++) {
		const parsedItem = JSON.parse(galleryItems[i]);
		if (parsedItem.sessionId === sessionId && parsedItem.version === version) {
			galleryItem = parsedItem;
			galleryItemKey = keys[i];
			break;
		}
	}

	if (!galleryItem) throw new Error("Gallery item not found");

	if (!galleryItem.upvotes) {
		galleryItem.upvotes = [];
	}

	if (galleryItem.upvotes.includes(voterIp)) {
		throw new Error("Already voted");
	}

	galleryItem.upvotes.push(voterIp);
	await saveToStorage(galleryItemKey, JSON.stringify(galleryItem));

	return galleryItem.upvotes.length;
}

export async function getUpvotes(sessionId: string, version: string): Promise<number> {
	const { value: itemStr } = await getFromStorageWithRegex(getStorageKey(sessionId, version));
	if (!itemStr) throw new Error("App not found");

	const item = JSON.parse(itemStr);
	const creatorIpHash = hashIP(item.creatorIP);

	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const keys = await redis.keys("gallery_*_" + creatorIpHash);
	const galleryItems = await redis.mget(...keys);

	let galleryItem;
	for (const itemStr of galleryItems) {
		const parsedItem = JSON.parse(itemStr);
		if (parsedItem.sessionId === sessionId && parsedItem.version === version) {
			galleryItem = parsedItem;
			break;
		}
	}

	if (!galleryItem) throw new Error("Gallery item not found");

	return galleryItem.upvotes?.length || 0;
}
