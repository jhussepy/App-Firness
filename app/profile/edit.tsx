import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { calculateCalorieTarget } from '@/lib/calorie-calculator';
import { useProfileStore } from '@/stores/profile.store';
import { useProgressStore } from '@/stores/progress.store';
import type { Goal, MealSlot } from '@/data/models/user';

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'lose_fat', label: 'Perder Grasa' },
  { value: 'gain_muscle', label: 'Ganancia Muscular' },
  { value: 'maintain', label: 'Mantener Peso' },
];

const MEAL_OPTIONS: { value: MealSlot; label: string }[] = [
  { value: 'breakfast', label: 'Desayuno' },
  { value: 'lunch', label: 'Almuerzo' },
  { value: 'dinner', label: 'Cena' },
  { value: 'snack1', label: 'Snack 1' },
  { value: 'snack2', label: 'Snack 2' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const update = useProfileStore((s) => s.update);
  const logMetric = useProgressStore((s) => s.logMetric);

  const [weightKg, setWeightKg] = useState(profile?.weightKg ? String(profile.weightKg) : '');
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'maintain');
  const [includedMeals, setIncludedMeals] = useState<MealSlot[]>(
    profile?.includedMeals ?? ['breakfast', 'lunch', 'dinner']
  );
  const [saving, setSaving] = useState(false);

  function toggleMeal(meal: MealSlot) {
    setIncludedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  }

  const canSave = weightKg.trim().length > 0 && includedMeals.length > 0 && !saving;

  async function handleSave() {
    if (!profile || !canSave) return;
    setSaving(true);

    const newWeight = parseFloat(weightKg);
    const weightChanged = newWeight !== profile.weightKg;

    const recalculated = calculateCalorieTarget({
      sex: profile.sex,
      weightKg: newWeight,
      heightCm: profile.heightCm ?? 170,
      age: profile.age ?? 25,
      lifestyle: profile.lifestyle ?? 'mostly_seated',
      activityLevel: profile.activityLevel ?? 'sedentary',
      goal,
      pace: profile.pace ?? 'moderate',
      dietType: profile.dietType ?? 'recommended',
    });

    await update({
      weightKg: newWeight,
      goal,
      includedMeals,
      dailyCalorieTarget: recalculated.calories,
      dailyMacroTargets: recalculated.macros,
    });

    if (weightChanged) {
      await logMetric({ date: new Date().toISOString(), type: 'weight', value: newWeight, unit: 'kg' });
    }

    setSaving(false);
    router.back();
  }

  return (
    <Screen>
      <ScreenHeader title="Editar perfil" />

      <TextField
        label="Peso actual (kg)"
        value={weightKg}
        onChangeText={setWeightKg}
        placeholder="70"
        keyboardType="decimal-pad"
      />

      <Text className="font-body-medium text-sm text-muted mb-2">Objetivo</Text>
      <View className="flex-row flex-wrap gap-2 mb-5">
        {GOAL_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setGoal(opt.value)}
            className={`rounded-full px-4 py-2 border ${
              goal === opt.value ? 'bg-primary border-primary' : 'bg-muted/30 border-border'
            }`}
          >
            <Text className={`font-body-medium text-sm ${goal === opt.value ? 'text-white' : 'text-fg'}`}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="font-body-medium text-sm text-muted mb-2">Comidas incluidas</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {MEAL_OPTIONS.map((opt) => {
          const selected = includedMeals.includes(opt.value);
          return (
            <Pressable
              key={opt.value}
              onPress={() => toggleMeal(opt.value)}
              className={`rounded-full px-4 py-2 border ${
                selected ? 'bg-primary border-primary' : 'bg-muted/30 border-border'
              }`}
            >
              <Text className={`font-body-medium text-sm ${selected ? 'text-white' : 'text-fg'}`}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label={saving ? 'Guardando...' : 'Guardar cambios'} onPress={handleSave} disabled={!canSave} />
    </Screen>
  );
}
