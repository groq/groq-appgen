interface ModelConfig {
    name: string;
    temperature: number;
    type: "text" | "vision";
    maxTokens?: number;
}

const MODEL_CONFIGS: { [key: string]: ModelConfig } = {
    "qwen-2.5-coder-32b": {
        name: "qwen-2.5-coder-32b",
        temperature: 0.1,
        type: "text",
        maxTokens: 32768
    },
    "qwen-qwq-32b": {
        name: "qwen-qwq-32b",
        temperature: 0.6,
        type: "text",
        maxTokens: 32768
    },
    "deepseek-r1-distill-llama-70b": {
        name: "deepseek-r1-distill-llama-70b",
        temperature: 0.6,
        type: "text",
        maxTokens: 16384
    },
    "qwen-2.5-32b": {
        name: "qwen-2.5-32b",
        temperature: 0.1,
        type: "text",
        maxTokens: 32768
    },
    "llama-3.3-70b-versatile": {
        name: "llama-3.3-70b-versatile",
        temperature: 0.1,
        type: "text",
        maxTokens: 32768
    },
    "llama-3.2-90b-vision-preview": {
        name: "llama-3.2-90b-vision-preview",
        temperature: 0.1,
        type: "vision"
    },
    "llama-3.2-11b-vision-preview": {
        name: "llama-3.2-11b-vision-preview",
        temperature: 0.1,
        type: "vision"
    }
};

// Default temperature if model not found in configs
const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_MAX_TOKENS = 8192;

// Export only text-based models for MODEL_OPTIONS
export const MODEL_OPTIONS = Object.entries(MODEL_CONFIGS)
    .filter(([_, config]) => config.type === "text")
    .map(([key, _]) => key);

export function getModelTemperature(modelName: string): number {
    return MODEL_CONFIGS[modelName]?.temperature ?? DEFAULT_TEMPERATURE;
}

export function getModelMaxTokens(modelName: string): number {
    return MODEL_CONFIGS[modelName]?.maxTokens ?? DEFAULT_MAX_TOKENS;
}

export function getModelConfig(modelName: string): ModelConfig {
    return MODEL_CONFIGS[modelName] ?? {
        name: modelName,
        temperature: DEFAULT_TEMPERATURE,
        type: "text"
    };
}

export function getFallbackModel(): string {
	// Use same model for fallback
	return "llama-3.3-70b-versatile";
}

export const PRIMARY_MODEL = "llama-3.3-70b-specdec";
export const VANILLA_MODEL = "llama-3.3-70b-versatile";

export const PRIMARY_VISION_MODEL = "llama-3.2-90b-vision-preview";
export const FALLBACK_VISION_MODEL = "llama-3.2-11b-vision-preview";
