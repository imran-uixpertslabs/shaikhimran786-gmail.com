
export interface GenerationResult {
  imageUrl: string;
  prompt: string;
}

export interface AppState {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
}
