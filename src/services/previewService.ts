import cache from './cache';

interface PreviewData {
  imageUrl: string | null;
  error?: string;
}

export class PreviewService {
  private static instance: PreviewService;
  public static readonly PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e0e0e0/808080?text=Preview+Coming+Soon';

  private constructor() {}

  public static getInstance(): PreviewService {
    if (!PreviewService.instance) {
      PreviewService.instance = new PreviewService();
    }
    return PreviewService.instance;
  }

  public async getPreview(url: string): Promise<PreviewData> {
    // Check cache first
    const cached = cache.get(url);
    if (cached) {
      return cached;
    }

    try {
      // For CGTrader URLs, return placeholder until API is ready
      if (url.includes('cgtrader.com')) {
        const result: PreviewData = { 
          imageUrl: PreviewService.PLACEHOLDER_IMAGE,
          error: 'CGTrader API integration pending'
        };
        cache.set(url, result);
        return result;
      }

      // For other URLs, we can implement different preview strategies here
      return {
        imageUrl: null,
        error: 'Unsupported URL type'
      };
    } catch (err) {
      console.error('Error processing URL:', err);
      return { 
        imageUrl: PreviewService.PLACEHOLDER_IMAGE, 
        error: 'Failed to process URL' 
      };
    }
  }
}

export default PreviewService.getInstance(); 