// The scanner needs a live server to keep the LogMeal token secret (see
// api/food-scan.ts), so unlike the rest of this local-only app it always
// talks to the deployed backend — there's no local equivalent to fall back
// to. Override via EXPO_PUBLIC_API_BASE_URL for a different deployment.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://app-firness.vercel.app';

export interface FoodScanResult {
  foodName: string;
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

export class FoodScanError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  no_food_detected: 'No pudimos identificar comida en la foto. Intenta con otro ángulo o mejor luz.',
  recognition_failed: 'El reconocimiento de imagen falló. Intenta de nuevo.',
  recognition_rate_limited: 'Se alcanzó el límite de escaneos por hoy. Intenta de nuevo más tarde.',
  recognition_unauthorized: 'El escáner no está disponible en este momento (credenciales inválidas).',
  nutrition_lookup_failed: 'No pudimos obtener la información nutricional. Intenta de nuevo.',
  image_too_large: 'La foto es demasiado grande. Intenta con otra.',
  missing_image: 'No se recibió ninguna foto.',
  invalid_image: 'La foto no se pudo procesar.',
  server_misconfigured: 'El escáner no está disponible en este momento.',
  upstream_error: 'No se pudo conectar con el servicio de reconocimiento.',
  network_error: 'Sin conexión. Revisa tu internet e intenta de nuevo.',
};

export function foodScanErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.upstream_error;
}

export async function scanFoodPhoto(imageBase64: string): Promise<FoodScanResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/food-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });
  } catch {
    throw new FoodScanError('network_error');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'upstream_error' }));
    let code: string = body.error ?? 'upstream_error';
    // api/food-scan.ts forwards LogMeal's HTTP status on recognition/nutrition
    // failures — split those into specific, actionable messages instead of
    // one generic "recognition failed" for every possible cause.
    if (body.status === 429) code = 'recognition_rate_limited';
    else if (body.status === 401 || body.status === 403) code = 'recognition_unauthorized';
    throw new FoodScanError(code);
  }

  return (await response.json()) as FoodScanResult;
}
