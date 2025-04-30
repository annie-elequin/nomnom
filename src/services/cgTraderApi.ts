interface CGTraderConfig {
  apiKey: string;
  // We'll add more config options as needed once we have API docs
}

interface ModelPreview {
  imageUrl: string | null;
  error?: string;
}

class CGTraderApi {
  private static instance: CGTraderApi;
  private config: CGTraderConfig | null = null;
  private readonly API_BASE_URL = 'https://api.cgtrader.com'; // We'll update this with actual base URL

  private constructor() {}

  public static getInstance(): CGTraderApi {
    if (!CGTraderApi.instance) {
      CGTraderApi.instance = new CGTraderApi();
    }
    return CGTraderApi.instance;
  }

  public configure(config: CGTraderConfig): void {
    this.config = config;
  }

  public isConfigured(): boolean {
    return !!this.config;
  }

  // This method will mirror our current preview service interface
  // so we can easily swap implementations
  public async getModelPreview(url: string): Promise<ModelPreview> {
    if (!this.config) {
      throw new Error('CGTrader API not configured. Please call configure() first.');
    }

    try {
      // TODO: Implement actual API call once we have access
      // For now, return placeholder to maintain compatibility
      return {
        imageUrl: 'https://placehold.co/600x400/e0e0e0/808080?text=API+Coming+Soon',
        error: 'API implementation pending'
      };
    } catch (error) {
      console.error('CGTrader API error:', error);
      return {
        imageUrl: null,
        error: 'Failed to fetch model preview'
      };
    }
  }

  // We'll add more methods here once we have API documentation
  // Potential methods might include:
  // - searchModels(query: string)
  // - getModelDetails(id: string)
  // - downloadModel(id: string)
  // etc.
}

export default CGTraderApi.getInstance(); 