interface ModelConfig {
    name: string;
    temperature: number;
    type: "text" | "vision";
    maxTokens?: number;
}

const MODEL_CONFIGS: { [key: string]: ModelConfig } = {
    "meta-llama/llama-4-maverick-17b-128e-instruct": {
        name: "meta-llama/llama-4-maverick-17b-128e-instruct",
        temperature: 0.1,
        type: "vision",
        maxTokens: 8192
    },
    "meta-llama/llama-4-scout-17b-16e-instruct": {
        name: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.1,
        type: "vision",
        maxTokens: 8192
    },
    "qwen-2.5-coder-32b": {
        name: "qwen-2.5-coder-32b",
        temperature: 0.1,
        type: "text",
        maxTokens: 32768
    },
    "deepseek-llama-70b": {
        name: "deepseek-llama-70b",
        temperature: 0.6,
        type: "text",
        maxTokens: 16384
    },
    "gemma-2-9b-it": {
        name: "gemma-2-9b-it",
        temperature: 0.7,
        type: "text",
        maxTokens: 8192
    },
    "whisper-large-v3-turbo": {
        name: "whisper-large-v3-turbo",
        temperature: 0.0,
        type: "text",
        maxTokens: 4096
    },
    // Manter modelos antigos para compatibilidade
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

// Lista limitada de modelos disponíveis para seleção
export const MODEL_OPTIONS = [
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen-2.5-coder-32b",
    "deepseek-llama-70b",
    "gemma-2-9b-it",
    "whisper-large-v3-turbo"
];

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

export const PRIMARY_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
export const FALLBACK_VISION_MODEL = "llama-3.2-90b-vision-preview";
