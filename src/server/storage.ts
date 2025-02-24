import { Redis } from "ioredis";
import crypto from "crypto";
import { createClient } from '@supabase/supabase-js';

interface GalleryItem {
	sessionId: string;
	version: string;
	title: string;
	description: string;
	upvotes?: number; // Number of upvotes
	createdAt: string; // ISO date string
	signature: string;
}

function hashIP(ip: string): string {
	return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 8);
}

const supabase = createClient(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_KEY!,
	{
		auth: {
			persistSession: false,
		}
	}
);

// Cache for gallery items
interface GalleryCache {
	items: GalleryItem[];
	lastFetch: number;
}

let galleryCache: GalleryCache | null = null;

export async function getGallery(): Promise<GalleryItem[]> {
	const now = Date.now();
	const CACHE_TTL = 30 * 1000;

	if (galleryCache && (now - galleryCache.lastFetch) < CACHE_TTL) {
		return galleryCache.items;
	}

	// Get all gallery items with pagination
	let allItems = [];
	let page = 0;
	const PAGE_SIZE = 1000;
	
	while (true) {
		const { data: items, error } = await supabase
			.from('gallery_items')
			.select(`
				id,
				session_id,
				version,
				title,
				description,
				signature,
				created_at
			`)
			.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
			.order('created_at', { ascending: false });

		if (error) throw error;
		if (!items || items.length === 0) break;
		
		allItems.push(...items);
		if (items.length < PAGE_SIZE) break;
		page++;
	}

	// Get all upvotes with pagination
	let allUpvotes = [];
	page = 0;
	
	while (true) {
		const { data: upvotes, error: upvoteError } = await supabase
			.from('upvotes')
			.select('gallery_item_id')
			.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

		if (upvoteError) throw upvoteError;
		if (!upvotes || upvotes.length === 0) break;
		
		allUpvotes.push(...upvotes);
		if (upvotes.length < PAGE_SIZE) break;
		page++;
	}

	// Count upvotes per gallery item
	const upvoteCounts = new Map();
	allUpvotes.forEach(vote => {
		const count = upvoteCounts.get(vote.gallery_item_id) || 0;
		upvoteCounts.set(vote.gallery_item_id, count + 1);
	});

	// Transform to GalleryItem format
	const galleryItems: GalleryItem[] = allItems.map(item => ({
		sessionId: item.session_id,
		version: item.version,
		title: item.title,
		description: item.description,
		signature: item.signature,
		createdAt: item.created_at,
		upvotes: upvoteCounts.get(item.id) || 0
	}));

	galleryCache = {
		items: galleryItems,
		lastFetch: now
	};

	return galleryItems;
}

export async function getUpvotes(sessionId: string, version: string): Promise<number> {
	// First get the gallery item ID
	const { data: item, error: itemError } = await supabase
		.from('gallery_items')
		.select('id')
		.eq('session_id', sessionId)
		.eq('version', version)
		.single();

	if (itemError) throw itemError;
	if (!item) throw new Error("Gallery item not found");

	// Then count upvotes for this item
	const { count, error: countError } = await supabase
		.from('upvotes')
		.select('*', { count: 'exact', head: true })
		.eq('gallery_item_id', item.id);

	if (countError) throw countError;
	return count || 0;
}

export async function isIPBlocked(ip: string): Promise<boolean> {
	const { count, error } = await supabase
		.from('blocked_ips')
		.select('*', { count: 'exact', head: true })
		.eq('ip_address', ip);

	if (error) throw error;
	return (count || 0) > 0;

}

// Helper function to get gallery item by session and version
export async function getGalleryItem(sessionId: string, version: string) {
	const { data, error } = await supabase
		.from('gallery_items')
		.select('id, session_id, version, title, description, signature, created_at, creator_ip_hash')
		.eq('session_id', sessionId)
		.eq('version', version)
		.single();

	if (error) throw error;
	return data;
}

// Legacy Redis function - no longer used
export function getStorageKey(sessionId: string, version: string, ip?: string): string {
	if (!ip) {
		return `${sessionId}/${version}/*`;
	}
	const ipHash = hashIP(ip);
	return `${sessionId}/${version}/${ipHash}`;
}

// Legacy Redis function - no longer used
function getGalleryKey(timestamp: number, randomHash: string, ip: string): string {
	const ipHash = hashIP(ip);
	return `gallery_${timestamp}_${randomHash}_${ipHash}`;
}

// Legacy Redis function - no longer used
export async function saveToStorage(key: string, value: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	await redis.set(key, value);
}

// Legacy Redis function - no longer used
export async function getFromStorage(key: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const value = await redis.get(key);
	return value;
}

// Legacy Redis function - no longer used
export async function getFromStorageWithRegex(key: string): Promise<{value: string, key: string}> {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const keys = await redis.keys(key);
	if(keys.length === 0) {
		throw new Error("Not found");
	}
	
	return {value: await getFromStorage(keys[0]), key: keys[0]};
}

// Legacy Redis function - no longer used
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

// Legacy Redis function - no longer used
export async function getBlockedIPs(): Promise<string[]> {
	const blockedIPsStr = await getFromStorage("blocked_ips");
	return blockedIPsStr ? JSON.parse(blockedIPsStr) : [];
}

export async function blockIP(ip: string, token: string) {
	if (token !== process.env.BLOCK_SECRET) {
		throw new Error("Invalid token");
	}

	// Add IP to blocked_ips table
	const { error: blockError } = await supabase
		.from('blocked_ips')
		.upsert({
			ip_address: ip
		});

	if (blockError) throw blockError;

	// Get all gallery items created by this IP
	const { data: items, error: itemsError } = await supabase
		.from('gallery_items')
		.select('id')
		.eq('creator_ip_hash', hashIP(ip));

	if (itemsError) throw itemsError;

	if (items && items.length > 0) {
		// Delete all gallery items by this IP (cascade will handle upvotes)
		const { error: deleteError } = await supabase
			.from('gallery_items')
			.delete()
			.eq('creator_ip_hash', hashIP(ip));

		if (deleteError) throw deleteError;
	}

	// Clear the gallery cache
	galleryCache = null;
}

export async function addToGallery(item: GalleryItem, creatorIP: string): Promise<boolean> {
	// Ensure createdAt is set
	item.createdAt = item.createdAt || new Date().toISOString();
	const creatorIpHash = hashIP(creatorIP);

	// Insert into gallery_items table
	const { data: galleryItem, error: insertError } = await supabase
		.from('gallery_items')
		.upsert({
			session_id: item.sessionId,
			version: item.version,
			title: item.title,
			description: item.description,
			signature: item.signature,
			created_at: item.createdAt,
			creator_ip_hash: creatorIpHash
		})
		.select()
		.single();

	if (insertError) throw insertError;
	if (!galleryItem) throw new Error("Failed to add gallery item");

	// Clear the gallery cache to ensure fresh data on next fetch
	galleryCache = null;

	return true;
}

export async function removeGalleryItem(sessionId: string, version: string, requestIP: string): Promise<boolean> {
	let redisSuccess = false;
	let supabaseSuccess = false;

	try {
		// Try Redis removal first
		try {
			const key = getStorageKey(sessionId, version);
			const { value } = await getFromStorageWithRegex(key);
			
			if (value) {
				const data = JSON.parse(value);
				if (data.creatorIP !== requestIP) {
					throw new Error("Unauthorized: You can only remove your own submissions");
				}

				const redis = new Redis(process.env.REDIS_URL!);
				await redis.del(key);
				await redis.quit();
				redisSuccess = true;
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("Unauthorized")) {
				throw error;
			}
			// Log but continue if Redis fails
			console.error("Redis removal error:", error);
		}

		// Try Supabase removal
		try {
			const requestIpHash = hashIP(requestIP);

			const { data: item, error: selectError } = await supabase
				.from('gallery_items')
				.select('id, creator_ip_hash')
				.eq('session_id', sessionId)
				.eq('version', version)
				.single();

			if (!selectError && item) {
				if (item.creator_ip_hash !== requestIpHash) {
					throw new Error("Unauthorized: You can only remove your own submissions");
				}

				const { error: deleteError } = await supabase
					.from('gallery_items')
					.delete()
					.eq('id', item.id);

				if (!deleteError) {
					supabaseSuccess = true;
					galleryCache = null; // Clear gallery cache on successful removal
				}
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("Unauthorized")) {
				throw error;
			}
			// Log but continue if Supabase fails
			console.error("Supabase removal error:", error);
		}

		// Return true if at least one storage removal succeeded
		return redisSuccess || supabaseSuccess;
	} catch (error) {
		console.error('Error in removeGalleryItem:', error);
		throw error;
	}
}

export async function upvoteGalleryItem(
	sessionId: string, 
	version: string, 
	voterIp: string,
	timestamp: string
): Promise<number> {

	// First get the gallery item ID
	const { data: item, error: itemError } = await supabase
		.from('gallery_items')
		.select('id')
		.eq('session_id', sessionId)
		.eq('version', version)
		.single();

	if (itemError) throw itemError;
	if (!item) throw new Error("Gallery item not found");

	// Check if this IP has already voted
	const { count: existingVote, error: voteCheckError } = await supabase
		.from('upvotes')
		.select('*', { count: 'exact', head: true })
		.eq('gallery_item_id', item.id)
		.eq('ip_address', voterIp);

	if (voteCheckError) throw voteCheckError;
	if (existingVote) throw new Error("Already voted");


	// Add the upvote with timestamp
	const { error: upvoteError } = await supabase
		.from('upvotes')
		.insert({
			gallery_item_id: item.id,

			ip_address: voterIp,
			created_at: timestamp
		});

	if (upvoteError) throw upvoteError;

	// Clear the gallery cache
	galleryCache = null;

	// Return new upvote count
	return await getUpvotes(sessionId, version);
}
