interface ModelConfig {
    name: string;
    temperature: number;
    type: "text" | "vision";
}

const MODEL_CONFIGS: { [key: string]: ModelConfig } = {
    "llama-3.3-70b-versatile": {
        name: "llama-3.3-70b-versatile",
        temperature: 0.1,
        type: "text"
    },
    "llama-3.3-70b-specdec": {
        name: "llama-3.3-70b-specdec",
        temperature: 0.1,
        type: "text"
    },
    "deepseek-r1-distill-llama-70b": {
        name: "deepseek-r1-distill-llama-70b",
        temperature: 0.6,
        type: "text"
    },
    "qwen-qwq-32b": {
        name: "qwen-qwq-32b",
        temperature: 0.6,
        type: "text"
    },
    "deepseek-r1-distill-llama-70b-specdec": {
        name: "deepseek-r1-distill-llama-70b-specdec",
        temperature: 0.6,
        type: "text"
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

// Export only text-based models for MODEL_OPTIONS
export const MODEL_OPTIONS = Object.entries(MODEL_CONFIGS)
    .filter(([_, config]) => config.type === "text")
    .map(([key, _]) => key);

export function getModelTemperature(modelName: string): number {
    return MODEL_CONFIGS[modelName]?.temperature ?? DEFAULT_TEMPERATURE;
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
