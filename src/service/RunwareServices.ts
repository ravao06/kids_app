import { toast } from "sonner";

const API_URL = "https://api.runware.ai/v1";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
  scheduler?: string;
  strength?: number;
  promptWeighting?: string;
  seed?: string;
  lora?: string[];
  imageBase64?: string;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export class RunwareService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImageFromSketch(
    imageBase64: string,
    prompt: string
  ): Promise<GeneratedImage | null> {
    try {
      const requestBody = [
        {
          taskType: "authentication",
          apiKey: this.apiKey
        },
        {
          taskType: "imageToImage",
          taskUUID: crypto.randomUUID(),
          positivePrompt: `realistic detailed image of ${prompt}, high quality, photorealistic`,
          model: "runware:100@1",
          width: 1024,
          height: 1024,
          numberResults: 1,
          outputFormat: "WEBP",
          imageBase64,
          strength: 0.8,
          CFGScale: 7.5
        }
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate image");
      }

      const responseData = await response.json();
      
      if (responseData.data && responseData.data.length > 1) {
        const imageData = responseData.data[1]; // Skip the authentication response
        return {
          imageURL: imageData.imageURL,
          positivePrompt: imageData.positivePrompt,
          seed: imageData.seed,
          NSFWContent: imageData.NSFWContent || false
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to transform your drawing into an image");
      return null;
    }
  }
}
