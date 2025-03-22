interface ModelConfig {
    name: string;
    temperature: number;
    type: "text" | "vision";
    maxTokens?: number;
    provider?: "groq" | "gemini";
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
    "deepseek-r1-distill-llama-70b-specdec": {
        name: "deepseek-r1-distill-llama-70b-specdec",
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
    "llama-3.3-70b-specdec": {
        name: "llama-3.3-70b-specdec",
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
    },
      // Add Gemini models
      "gemini-2.0-flash-lite": {
        name: "gemini-2.0-flash-lite",
        temperature: 0.6,
        type: "text",
        maxTokens: 8192,
        provider: "gemini"
    },
    "gemini-2.0-pro": {
        name: "gemini-2.0-pro", 
        temperature: 0.7,
        type: "text",
        maxTokens: 8192,
        provider: "gemini"
    },
    "gemini-2.0-pro-vision": {
        name: "gemini-2.0-pro-vision",
        temperature: 0.7,
        type: "vision",
        maxTokens: 4096,
        provider: "gemini"
    }  
};

// Default temperature if model not found in configs
const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_MAX_TOKENS = 8192;

// Export only text-based models for MODEL_OPTIONS
export const MODEL_OPTIONS = Object.entries(MODEL_CONFIGS)
    .filter(([_, config]) => config.type === "text")
    .map(([key, _]) => key);

// Helper to determine which provider to use
export function getModelProvider(modelName: string): "groq" | "gemini" {
    return MODEL_CONFIGS[modelName]?.provider || "groq";
}
   
// Helper to check if it's a Gemini model
export function isGeminiModel(modelName: string): boolean {
    return getModelProvider(modelName) === "gemini";
}

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
