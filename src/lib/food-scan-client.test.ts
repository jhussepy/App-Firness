import { foodScanErrorMessage } from './food-scan-client';

describe('foodScanErrorMessage', () => {
  it('maps a known error code to its Spanish message', () => {
    expect(foodScanErrorMessage('no_food_detected')).toContain('No pudimos identificar comida');
    expect(foodScanErrorMessage('network_error')).toContain('Sin conexión');
  });

  it('falls back to a generic message for unknown codes', () => {
    expect(foodScanErrorMessage('some_unmapped_code')).toBe(foodScanErrorMessage('upstream_error'));
  });

  it('distinguishes rate-limit and auth failures from a generic recognition failure', () => {
    expect(foodScanErrorMessage('recognition_rate_limited')).toContain('límite de escaneos');
    expect(foodScanErrorMessage('recognition_unauthorized')).toContain('credenciales inválidas');
    expect(foodScanErrorMessage('recognition_rate_limited')).not.toBe(foodScanErrorMessage('recognition_failed'));
  });
});
