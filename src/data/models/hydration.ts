// One row per local calendar day — glasses logged that day, tapped up one
// at a time. Mirrors the "singleton keyed by a natural id" shape used
// elsewhere (meal plan's fixed 'current' id) rather than one row per glass,
// since the UI only ever needs a running daily total.
export interface WaterDay {
  id: string; // local "YYYY-MM-DD", same as `date`
  date: string;
  glasses: number;
  updatedAt: string;
}
