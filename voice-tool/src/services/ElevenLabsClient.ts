import { VoiceSettings, ErrorType } from '../types/index.js';

export class ElevenLabsClient {
  private apiKey: string;
  private baseUrl: string;
  private maxRetries: number;
  private timeoutSeconds: number;

  constructor(apiKey: string, baseUrl = 'https://api.elevenlabs.io', maxRetries = 3, timeoutSeconds = 240) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.maxRetries = maxRetries;
    this.timeoutSeconds = timeoutSeconds;
  }

  async generateAudio(text: string, voiceId: string, settings: VoiceSettings): Promise<ArrayBuffer> {
    const url = `${this.baseUrl}/v1/text-to-speech/${voiceId}`;
    
    const requestBody = {
      text,
      model_id: settings.modelId,
      voice_settings: {
        stability: settings.stability,
        similarity_boost: settings.similarityBoost,
        style: settings.style,
        use_speaker_boost: settings.useSpeakerBoost
      },
      output_format: settings.outputFormat
    };

    return await this.executeWithRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutSeconds * 1000);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ElevenLabsError(
            `API request failed: ${response.status} ${response.statusText}`,
            response.status,
            await response.text()
          );
        }

        return await response.arrayBuffer();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }, `generateAudio for "${text}"`);
  }

  async validateApiKey(): Promise<boolean> {
    try {
      // Try to get voices instead of user info (requires fewer permissions)
      const response = await fetch(`${this.baseUrl}/v1/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getAvailableVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }
      
      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        const errorType = this.classifyError(error as Error);
        
        // Don't retry authentication errors
        if (errorType === ErrorType.Authentication) {
          throw new ElevenLabsError(
            `Authentication failed: Invalid API key. Please check your ELEVENLABS_API_KEY.`,
            401
          );
        }

        // Don't retry if we've exceeded max attempts
        if (attempt > this.maxRetries) {
          throw lastError;
        }

        // Don't retry validation errors
        if (errorType === ErrorType.Validation) {
          throw lastError;
        }

        console.log(`⚠️  Attempt ${attempt} failed for ${context}: ${lastError.message}`);
        console.log(`🔄 Retrying in ${this.getRetryDelay(attempt)}ms...`);
        
        await this.sleep(this.getRetryDelay(attempt));
      }
    }

    throw lastError!;
  }

  private classifyError(error: Error): ErrorType {
    if (error.name === 'AbortError') {
      return ErrorType.Timeout;
    }

    if (error instanceof ElevenLabsError) {
      if (error.statusCode === 401 || error.statusCode === 403) {
        return ErrorType.Authentication;
      }
      if (error.statusCode === 422) {
        return ErrorType.Validation;
      }
      if (error.statusCode === 429) {
        return ErrorType.RateLimit;
      }
      if (error.statusCode && error.statusCode >= 500) {
        return ErrorType.ServerError;
      }
    }

    if (error.message.includes('fetch')) {
      return ErrorType.Network;
    }

    return ErrorType.Unknown;
  }

  private getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s
    return Math.min(1000 * Math.pow(2, attempt - 1), 8000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class ElevenLabsError extends Error {
  public statusCode?: number;
  public responseBody?: string;

  constructor(message: string, statusCode?: number, responseBody?: string) {
    super(message);
    this.name = 'ElevenLabsError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}
