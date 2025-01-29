export function getFallbackModel(): string {
	// Use same model for fallback
	return "deepseek-r1-distill-llama-70b";
}

export const PRIMARY_MODEL = "deepseek-r1-distill-llama-70b";
export const VANILLA_MODEL = "deepseek-r1-distill-llama-70b";

export const PRIMARY_VISION_MODEL = "llama-3.2-90b-vision-preview";
export const FALLBACK_VISION_MODEL = "llama-3.2-11b-vision-preview";
