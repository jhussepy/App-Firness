export type ProgressMetricType = 'weight' | 'body_fat_pct' | 'measurement';

export type MeasurementSite = 'waist' | 'chest' | 'arm' | 'thigh' | 'hip';

export interface ProgressMetric {
  id: string;
  date: string;
  type: ProgressMetricType;
  value: number;
  measurementSite?: MeasurementSite;
  unit: 'kg' | 'lb' | 'cm' | 'in' | '%';
}
