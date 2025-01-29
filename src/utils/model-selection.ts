export function getFallbackModel(): string {
	// Use same model for fallback
	return "llama-3.3-70b-versatile";
}

export const PRIMARY_MODEL = "llama-3.3-70b-specdec";
export const VANILLA_MODEL = "llama-3.3-70b-versatile";

export const PRIMARY_VISION_MODEL = "llama-3.2-90b-vision-preview";
export const FALLBACK_VISION_MODEL = "llama-3.2-11b-vision-preview";
