'use client';

/**
 * TensorFlow.js Vision Classifier
 * Uses COCO-SSD (object detection) + MobileNet (image classification)
 * to identify scrap objects entirely in the browser — no API key needed.
 *
 * Object → Scrap category mapping for Kerala scrap marketplace.
 */

import type { DetectionOutput, ScrapItemValuation } from './scrapVisionClassifier';

// ─────────────────────────────────────────────────────────────────────────────
// Maps COCO-SSD / MobileNet labels → scrap category + Kerala rates
// ─────────────────────────────────────────────────────────────────────────────
interface ScrapMapping {
  title: string;
  category: 'Paper' | 'Metal' | 'Electronics' | 'Plastic' | 'Others';
  subcategory: string;
  items: Omit<ScrapItemValuation, 'id'>[];
}

const OBJECT_TO_SCRAP: Record<string, ScrapMapping> = {
  // Electronics
  tv: {
    title: 'Old Television (TV)',
    category: 'Electronics',
    subcategory: 'LCD/LED TV',
    items: [
      { name: 'LCD/LED Television (Scrap)', category: 'Electronics', qty: 1, unit: 'piece', minRate: 400, maxRate: 900, condition: 'Non-working screen intact', confidence: 0.91 },
      { name: 'Copper Deflection Yoke', category: 'Metal', qty: 1.2, unit: 'kg', minRate: 460, maxRate: 560, condition: 'Copper salvage from TV', confidence: 0.85 },
    ],
  },
  monitor: {
    title: 'Old Computer Monitor',
    category: 'Electronics',
    subcategory: 'LCD/LED TV',
    items: [
      { name: 'LCD Monitor (Scrap)', category: 'Electronics', qty: 1, unit: 'piece', minRate: 300, maxRate: 700, condition: 'Non-working display', confidence: 0.90 },
    ],
  },
  laptop: {
    title: 'Dead Laptop / Notebook',
    category: 'Electronics',
    subcategory: 'Laptop/PC',
    items: [
      { name: 'Dead Laptop / Notebook PC', category: 'Electronics', qty: 1, unit: 'piece', minRate: 850, maxRate: 2400, condition: 'Motherboard + screen salvage', confidence: 0.95 },
      { name: 'Laptop Charger & Battery', category: 'Electronics', qty: 1, unit: 'piece', minRate: 150, maxRate: 350, condition: 'Original accessories', confidence: 0.88 },
    ],
  },
  'cell phone': {
    title: 'Old Mobile Phone',
    category: 'Electronics',
    subcategory: 'Mobile Phone',
    items: [
      { name: 'Non-working Mobile Phone', category: 'Electronics', qty: 1, unit: 'piece', minRate: 200, maxRate: 600, condition: 'Non-working handset', confidence: 0.93 },
    ],
  },
  keyboard: {
    title: 'Computer Keyboard (E-Waste)',
    category: 'Electronics',
    subcategory: 'Laptop/PC',
    items: [
      { name: 'Computer Keyboard / Mouse (E-Waste)', category: 'Electronics', qty: 1, unit: 'piece', minRate: 50, maxRate: 150, condition: 'Used peripherals', confidence: 0.88 },
    ],
  },
  mouse: {
    title: 'Computer Mouse (E-Waste)',
    category: 'Electronics',
    subcategory: 'Laptop/PC',
    items: [
      { name: 'Computer Peripherals (E-Waste)', category: 'Electronics', qty: 1, unit: 'piece', minRate: 30, maxRate: 100, condition: 'Used accessories', confidence: 0.86 },
    ],
  },
  refrigerator: {
    title: 'Old Refrigerator / Fridge',
    category: 'Electronics',
    subcategory: 'Refrigerator',
    items: [
      { name: 'Non-working Refrigerator', category: 'Electronics', qty: 1, unit: 'piece', minRate: 800, maxRate: 1800, condition: 'Non-working, compressor intact', confidence: 0.93 },
      { name: 'Copper Compressor Coil', category: 'Metal', qty: 1.5, unit: 'kg', minRate: 460, maxRate: 560, condition: 'Copper salvage', confidence: 0.88 },
    ],
  },
  microwave: {
    title: 'Microwave Oven (E-Waste)',
    category: 'Electronics',
    subcategory: 'Washing Machine',
    items: [
      { name: 'Microwave Oven (Scrap)', category: 'Electronics', qty: 1, unit: 'piece', minRate: 300, maxRate: 700, condition: 'Non-working unit', confidence: 0.89 },
    ],
  },

  // Paper
  book: {
    title: 'Books & Magazines',
    category: 'Paper',
    subcategory: 'Books',
    items: [
      { name: 'Old Books & Magazines', category: 'Paper', qty: 10, unit: 'kg', minRate: 10, maxRate: 14, condition: 'Intact pages, no moisture', confidence: 0.94 },
      { name: 'Cardboard Covers', category: 'Paper', qty: 3, unit: 'kg', minRate: 9, maxRate: 13, condition: 'Dry clean covers', confidence: 0.88 },
    ],
  },
  newspaper: {
    title: 'Newspapers (Pathram)',
    category: 'Paper',
    subcategory: 'Newspaper',
    items: [
      { name: 'Newspaper Bundles (Pathram)', category: 'Paper', qty: 18, unit: 'kg', minRate: 13, maxRate: 17, condition: 'Dry stacked bundles', confidence: 0.97 },
    ],
  },

  // Plastic / Bottles
  bottle: {
    title: 'PET Bottles & Plastic',
    category: 'Plastic',
    subcategory: 'PET Bottles',
    items: [
      { name: 'PET Water / Beverage Bottles', category: 'Plastic', qty: 7, unit: 'kg', minRate: 10, maxRate: 16, condition: 'Empty, cleaned plastic', confidence: 0.94 },
      { name: 'HDPE Hard Plastic Containers', category: 'Plastic', qty: 3, unit: 'kg', minRate: 8, maxRate: 12, condition: 'Rigid containers', confidence: 0.88 },
    ],
  },
  'wine glass': {
    title: 'Glass Scrap',
    category: 'Others',
    subcategory: 'Glass',
    items: [
      { name: 'Glass Scrap (Bottles / Jars)', category: 'Others', qty: 8, unit: 'kg', minRate: 4, maxRate: 8, condition: 'Intact glass', confidence: 0.88 },
    ],
  },
  cup: {
    title: 'Plastic / Glass Scrap',
    category: 'Plastic',
    subcategory: 'Mixed Plastic',
    items: [
      { name: 'Mixed Plastic Cups & Containers', category: 'Plastic', qty: 4, unit: 'kg', minRate: 6, maxRate: 10, condition: 'Mixed clean plastic', confidence: 0.86 },
    ],
  },

  // Metal & Furniture
  chair: {
    title: 'Iron / Steel Chair (Scrap)',
    category: 'Metal',
    subcategory: 'Iron/Steel',
    items: [
      { name: 'Iron / Steel Chair Frame', category: 'Metal', qty: 6, unit: 'kg', minRate: 26, maxRate: 36, condition: 'Solid iron / steel frame', confidence: 0.91 },
      { name: 'Aluminium Armrests / Parts', category: 'Metal', qty: 1, unit: 'kg', minRate: 85, maxRate: 120, condition: 'Scrap aluminium', confidence: 0.83 },
    ],
  },
  'dining table': {
    title: 'Iron / Wooden Table (Scrap)',
    category: 'Metal',
    subcategory: 'Iron/Steel',
    items: [
      { name: 'Iron Table Frame / Legs', category: 'Metal', qty: 8, unit: 'kg', minRate: 26, maxRate: 36, condition: 'Iron scrap', confidence: 0.90 },
    ],
  },
  bicycle: {
    title: 'Old Bicycle (Iron Scrap)',
    category: 'Metal',
    subcategory: 'Iron/Steel',
    items: [
      { name: 'Iron / Steel Bicycle Frame', category: 'Metal', qty: 8, unit: 'kg', minRate: 26, maxRate: 36, condition: 'Solid iron frame', confidence: 0.93 },
      { name: 'Rubber Tyres', category: 'Others', qty: 2, unit: 'kg', minRate: 8, maxRate: 20, condition: 'Old rubber tyres', confidence: 0.87 },
    ],
  },
  car: {
    title: 'Car Body Parts (Iron Scrap)',
    category: 'Metal',
    subcategory: 'Iron/Steel',
    items: [
      { name: 'Iron / Steel Car Body Scrap', category: 'Metal', qty: 30, unit: 'kg', minRate: 26, maxRate: 36, condition: 'Heavy steel scrap', confidence: 0.92 },
      { name: 'Copper Wiring Harness', category: 'Metal', qty: 2, unit: 'kg', minRate: 460, maxRate: 560, condition: 'Copper cable scrap', confidence: 0.87 },
    ],
  },
  'potted plant': {
    title: 'Plastic / Metal Planter',
    category: 'Plastic',
    subcategory: 'Mixed Plastic',
    items: [
      { name: 'Plastic Pots / Garden Items', category: 'Plastic', qty: 3, unit: 'kg', minRate: 6, maxRate: 10, condition: 'Mixed plastic', confidence: 0.82 },
    ],
  },
  scissors: {
    title: 'Iron / Steel Scrap',
    category: 'Metal',
    subcategory: 'Iron/Steel',
    items: [
      { name: 'Iron / Steel Household Scrap', category: 'Metal', qty: 2, unit: 'kg', minRate: 26, maxRate: 36, condition: 'Small iron items', confidence: 0.87 },
    ],
  },
  knife: {
    title: 'Iron / Steel Scrap',
    category: 'Metal',
    subcategory: 'Iron/Steel',
    items: [
      { name: 'Iron / Steel Cutlery Scrap', category: 'Metal', qty: 1, unit: 'kg', minRate: 26, maxRate: 36, condition: 'Steel items', confidence: 0.87 },
    ],
  },
  'sports ball': {
    title: 'Rubber / Plastic Scrap',
    category: 'Others',
    subcategory: 'Tyres/Rubber',
    items: [
      { name: 'Rubber / Plastic Sports Scrap', category: 'Others', qty: 2, unit: 'kg', minRate: 8, maxRate: 20, condition: 'Old rubber items', confidence: 0.80 },
    ],
  },
  suitcase: {
    title: 'Mixed Plastic / Metal Scrap',
    category: 'Plastic',
    subcategory: 'Mixed Plastic',
    items: [
      { name: 'Plastic / ABS Suitcase Scrap', category: 'Plastic', qty: 3, unit: 'kg', minRate: 6, maxRate: 10, condition: 'Hard plastic shell', confidence: 0.85 },
    ],
  },
};

// Extra keyword mapping for MobileNet classification labels
const MOBILENET_KEYWORD_MAP: Record<string, string> = {
  'television': 'tv',
  'television set': 'tv',
  'screen': 'monitor',
  'display': 'monitor',
  'computer': 'laptop',
  'desktop': 'laptop',
  'pc': 'laptop',
  'phone': 'cell phone',
  'smartphone': 'cell phone',
  'mobile': 'cell phone',
  'fridge': 'refrigerator',
  'freezer': 'refrigerator',
  'oven': 'microwave',
  'plastic bottle': 'bottle',
  'water bottle': 'bottle',
  'glass bottle': 'bottle',
  'container': 'bottle',
  'newspaper': 'newspaper',
  'magazine': 'book',
  'paperback': 'book',
  'textbook': 'book',
  'iron': 'scissors',
  'steel': 'scissors',
  'metal': 'scissors',
  'bicycle': 'bicycle',
  'bike': 'bicycle',
  'vehicle': 'car',
  'automobile': 'car',
};

function mapLabelToScrapKey(label: string): string | null {
  const lower = label.toLowerCase().trim();

  // Direct match
  if (OBJECT_TO_SCRAP[lower]) return lower;

  // Keyword map
  for (const [keyword, key] of Object.entries(MOBILENET_KEYWORD_MAP)) {
    if (lower.includes(keyword)) return key;
  }

  // Partial match against scrap keys
  for (const key of Object.keys(OBJECT_TO_SCRAP)) {
    if (lower.includes(key) || key.includes(lower)) return key;
  }

  return null;
}

function buildOutput(scrapKey: string, confidence: number): DetectionOutput {
  const mapping = OBJECT_TO_SCRAP[scrapKey];
  return {
    detectedTitle: mapping.title,
    primaryCategory: mapping.category,
    confidence: Math.round(Math.min(0.97, Math.max(0.80, confidence)) * 100) / 100,
    description: `Detected by TensorFlow.js AI as ${mapping.subcategory}. Kerala scrap rates applied.`,
    items: mapping.items.map((item, idx) => ({ ...item, id: `tf-${idx + 1}` })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main TF.js detection function
// Lazy-loads models on first call, then caches them
// ─────────────────────────────────────────────────────────────────────────────
let cocoSsdModel: any = null;
let mobilenetModel: any = null;
let tfLoaded = false;

async function loadModels(): Promise<void> {
  if (tfLoaded) return;

  // Dynamic imports so Next.js doesn't SSR them
  const tf = await import('@tensorflow/tfjs');
  await tf.ready();

  const cocoSsd = await import('@tensorflow-models/coco-ssd');
  cocoSsdModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });

  const mobilenet = await import('@tensorflow-models/mobilenet');
  mobilenetModel = await mobilenet.load({ version: 2, alpha: 0.5 });

  tfLoaded = true;
}

export async function detectWithTensorFlow(dataUrl: string): Promise<DetectionOutput | null> {
  try {
    // Load models (cached after first call)
    await loadModels();

    // Create an HTMLImageElement from the data URL
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    // Run COCO-SSD object detection
    const cocoDetections = await cocoSsdModel.detect(img);

    // Run MobileNet classification
    const mobileClassifications = await mobilenetModel.classify(img);

    // Collect all labels with scores
    const candidates: Array<{ label: string; score: number }> = [];

    for (const d of cocoDetections) {
      candidates.push({ label: d.class, score: d.score });
    }
    for (const c of mobileClassifications) {
      // MobileNet returns comma-separated synsets like "laptop, laptop computer"
      const labels = c.className.split(',').map((l: string) => l.trim());
      for (const label of labels) {
        candidates.push({ label, score: c.probability });
      }
    }

    // Sort by confidence descending
    candidates.sort((a, b) => b.score - a.score);

    // Find the best matching scrap mapping
    for (const candidate of candidates) {
      const scrapKey = mapLabelToScrapKey(candidate.label);
      if (scrapKey) {
        return buildOutput(scrapKey, candidate.score);
      }
    }

    // No known scrap object detected
    return null;
  } catch (err) {
    console.warn('TensorFlow.js detection failed:', err);
    return null;
  }
}
