import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface DetectionResult {
  category: string;
  subcategory: string;
  confidence: number;
  condition: string;
}

const SCRAP_CATEGORIES = {
  Paper: ['Newspaper', 'Cardboard', 'Books', 'Office Paper'],
  Metal: ['Iron/Steel', 'Aluminum', 'Copper', 'Brass'],
  Electronics: ['CRT TV', 'LCD/LED TV', 'Laptop/PC', 'Mobile Phone', 'Refrigerator', 'AC', 'Washing Machine', 'Mixed Cables'],
  Plastic: ['PET Bottles', 'HDPE', 'Mixed Plastic'],
  Others: ['Glass', 'Tyres/Rubber', 'Wooden Furniture'],
};

const DETECTION_PROMPT = `You are a scrap material identification expert for an Indian scrap marketplace.
Analyze this image and identify ALL scrap materials present.

Valid categories and subcategories:
${JSON.stringify(SCRAP_CATEGORIES, null, 2)}

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "category": "Electronics",
    "subcategory": "CRT TV",
    "confidence": 0.91,
    "condition": "non-working"
  }
]

Rules:
- confidence: 0.0 to 1.0 (how sure you are)
- condition: "working", "non-working", "clean", "damaged", or "unknown"
- Only include items from the valid categories/subcategories above
- If you cannot identify any scrap, return an empty array []
- Be concise, only JSON, no explanation`;

@Injectable()
export class DetectionService {
  private readonly logger = new Logger(DetectionService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private config: ConfigService) {
    const apiKey = config.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async analyze(imageUrl: string): Promise<DetectionResult[]> {
    if (!this.genAI) {
      this.logger.warn('Gemini API not configured — returning mock detection');
      return this.mockDetection();
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Fetch image as base64
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = response.headers.get('content-type') || 'image/jpeg';

      const result = await model.generateContent([
        {
          inlineData: { data: base64, mimeType },
        },
        DETECTION_PROMPT,
      ]);

      const text = result.response.text().trim();
      // Extract JSON from response (in case model adds markdown)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const detections = JSON.parse(jsonMatch[0]) as DetectionResult[];
      return detections.filter(
        (d) =>
          d.category &&
          d.subcategory &&
          typeof d.confidence === 'number' &&
          SCRAP_CATEGORIES[d.category as keyof typeof SCRAP_CATEGORIES]?.includes(d.subcategory),
      );
    } catch (err) {
      this.logger.error('Gemini detection failed:', err);
      return [];
    }
  }

  private mockDetection(): DetectionResult[] {
    return [
      {
        category: 'Electronics',
        subcategory: 'CRT TV',
        confidence: 0.91,
        condition: 'non-working',
      },
    ];
  }

  getCategories() {
    return SCRAP_CATEGORIES;
  }
}
