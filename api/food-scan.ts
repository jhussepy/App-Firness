// Vercel Serverless Function (auto-detected from the /api directory).
// Proxies a food photo to the LogMeal API so the LOGMEAL_API_TOKEN never
// reaches the client bundle — the app is otherwise fully local/no-backend,
// this is the one exception needed to make photo-based food recognition
// real instead of mocked.

interface LogMealSegmentationResponse {
  imageId: number;
}

interface LogMealNutrient {
  label?: string;
  quantity?: number;
  unit?: string;
}

interface LogMealNutritionalInfoResponse {
  foodName?: string | string[];
  hasNutritionalInfo?: boolean;
  nutritional_info?: {
    calories?: number;
    totalNutrients?: Record<string, LogMealNutrient>;
  };
}

interface ScanResult {
  foodName: string;
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

const LOGMEAL_BASE_URL = 'https://api.logmeal.com';
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

function pickNutrient(totalNutrients: Record<string, LogMealNutrient> | undefined, codes: string[], labelHints: string[]): number {
  if (!totalNutrients) return 0;
  for (const code of codes) {
    const value = totalNutrients[code]?.quantity;
    if (typeof value === 'number') return value;
  }
  for (const nutrient of Object.values(totalNutrients)) {
    const label = nutrient.label?.toLowerCase() ?? '';
    if (labelHints.some((hint) => label.includes(hint)) && typeof nutrient.quantity === 'number') {
      return nutrient.quantity;
    }
  }
  return 0;
}

function pickFoodName(foodName: string | string[] | undefined): string {
  if (Array.isArray(foodName)) return foodName[0] ?? 'Comida escaneada';
  return foodName || 'Comida escaneada';
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const token = process.env.LOGMEAL_API_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'server_misconfigured' });
    return;
  }

  const imageBase64: unknown = req.body?.imageBase64;
  if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
    res.status(400).json({ error: 'missing_image' });
    return;
  }

  let bytes: Uint8Array<ArrayBuffer>;
  try {
    const binary = atob(imageBase64.replace(/^data:.*;base64,/, ''));
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
  } catch {
    res.status(400).json({ error: 'invalid_image' });
    return;
  }
  if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
    res.status(400).json({ error: 'image_too_large' });
    return;
  }

  try {
    const form = new FormData();
    form.append('image', new Blob([bytes]), 'meal.jpg');

    const segRes = await fetch(`${LOGMEAL_BASE_URL}/v2/image/segmentation/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!segRes.ok) {
      res.status(502).json({ error: 'recognition_failed', status: segRes.status });
      return;
    }
    const segData = (await segRes.json()) as LogMealSegmentationResponse;

    const nutRes = await fetch(`${LOGMEAL_BASE_URL}/v2/nutrition/recipe/nutritionalInfo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId: segData.imageId }),
    });
    if (!nutRes.ok) {
      res.status(502).json({ error: 'nutrition_lookup_failed', status: nutRes.status });
      return;
    }
    const nutData = (await nutRes.json()) as LogMealNutritionalInfoResponse;

    if (!nutData.hasNutritionalInfo) {
      res.status(422).json({ error: 'no_food_detected' });
      return;
    }

    const totals = nutData.nutritional_info?.totalNutrients;
    const result: ScanResult = {
      foodName: pickFoodName(nutData.foodName),
      calories: Math.round(nutData.nutritional_info?.calories ?? 0),
      proteinG: Math.round(pickNutrient(totals, ['PROCNT'], ['protein'])),
      carbG: Math.round(pickNutrient(totals, ['CHOCDF', 'CHOCDF.net'], ['carbohydrate', 'carb'])),
      fatG: Math.round(pickNutrient(totals, ['FAT'], ['fat'])),
    };

    res.status(200).json(result);
  } catch {
    res.status(502).json({ error: 'upstream_error' });
  }
}
