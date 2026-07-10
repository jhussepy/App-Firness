import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OptionCard } from '@/components/onboarding/OptionCard';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { StepHeader } from '@/components/onboarding/StepHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { progressRepository } from '@/data/repositories/progress.repository';
import { calculateCalorieTarget } from '@/lib/calorie-calculator';
import { generateId } from '@/lib/ids';
import { useProfileStore } from '@/stores/profile.store';
import { useThemeStore } from '@/stores/theme.store';
import type {
  ActivityLevel,
  DietType,
  DietaryPreference,
  Goal,
  Lifestyle,
  MealSlot,
  Pace,
  Sex,
} from '@/data/models/user';

interface Draft {
  name: string;
  sex?: Sex;
  age: string;
  heightCm: string;
  weightKg: string;
  goal?: Goal;
  activityLevel?: ActivityLevel;
  lifestyle?: Lifestyle;
  hasMedicalCondition?: boolean;
  dietType?: DietType;
  dietaryPreference?: DietaryPreference;
  includedMeals: MealSlot[];
  targetWeightKg: string;
  pace?: Pace;
}

const TOTAL_STEPS = 10;

const GOAL_OPTIONS: { value: Goal; icon: string; title: string; description: string }[] = [
  { value: 'lose_fat', icon: '🔥', title: 'Perder Grasa', description: 'Optimiza la pérdida de peso y conserva tu masa muscular' },
  { value: 'gain_muscle', icon: '💪', title: 'Ganancia Muscular', description: 'Incrementa tu peso y hazte más fuerte' },
  { value: 'maintain', icon: '❤️', title: 'Mantener Peso', description: 'Mantén tu peso estable y busca la recomposición corporal' },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; icon: string; title: string }[] = [
  { value: 'sedentary', icon: '🚫', title: 'No Hago Ejercicio' },
  { value: 'light', icon: '🔥', title: '1-2 días por semana' },
  { value: 'moderate', icon: '🔥', title: '3-4 días por semana' },
  { value: 'active', icon: '🔥', title: '5-6 días por semana' },
  { value: 'very_active', icon: '🔥', title: 'Diario' },
];

const LIFESTYLE_OPTIONS: { value: Lifestyle; icon: string; title: string; description: string }[] = [
  { value: 'mostly_seated', icon: '🧑‍💻', title: 'Mayormente Sentado', description: 'Trabajo de oficina o en casa' },
  { value: 'sometimes_standing', icon: '🚶', title: 'A veces de pie', description: 'Mezcla de estar sentado y moverte' },
  { value: 'mostly_standing', icon: '🚶', title: 'Mayormente de pie', description: 'De pie o caminando con regularidad' },
  { value: 'moving_all_day', icon: '🏃', title: 'En movimiento todo el día', description: 'Trabajo físico o caminatas frecuentes' },
  { value: 'intense_physical', icon: '🏗️', title: 'Trabajo físico intenso', description: 'Labor pesada' },
];

const DIET_TYPE_OPTIONS: { value: DietType; icon: string; title: string; description: string }[] = [
  { value: 'recommended', icon: '🥣', title: 'Recomendada', description: 'La mejor para ti. Mezcla óptima de proteínas, carbohidratos y grasas' },
  { value: 'high_protein', icon: '🍗', title: 'Alta en proteínas', description: 'Más proteínas, menos carbohidratos y grasas' },
  { value: 'low_carb', icon: '🥑', title: 'Baja en carbohidratos', description: 'Menos carbohidratos, más grasas y proteínas moderadas' },
  { value: 'keto', icon: '🫙', title: 'Keto', description: 'Muy baja en carbohidratos, alta en grasas y proteínas moderadas' },
  { value: 'low_fat', icon: '🥔', title: 'Baja en grasas', description: 'Menos grasas, más carbohidratos y proteínas moderadas' },
];

const DIETARY_PREFERENCE_OPTIONS: { value: DietaryPreference; icon: string; title: string; description: string }[] = [
  { value: 'balanced', icon: '🍗', title: 'Balanceado', description: 'Flexible. Puedes establecer alergias e intolerancias más tarde.' },
  { value: 'pescetarian', icon: '🐟', title: 'Pescetariano', description: 'Plantas, pescado, mariscos, huevos y lácteos. Sin carne.' },
  { value: 'vegetarian', icon: '🥚', title: 'Vegetariano', description: 'Alimentos de origen vegetal, huevos y lácteos. Sin carne ni pescado.' },
  { value: 'vegan', icon: '🥦', title: 'Vegano', description: 'Totalmente basado en plantas sin productos de origen animal.' },
];

const MEAL_OPTIONS: { value: MealSlot; title: string; isPrincipal: boolean }[] = [
  { value: 'breakfast', title: 'Desayuno', isPrincipal: true },
  { value: 'lunch', title: 'Almuerzo', isPrincipal: true },
  { value: 'dinner', title: 'Cena', isPrincipal: true },
  { value: 'snack1', title: 'Snack 1', isPrincipal: false },
  { value: 'snack2', title: 'Snack 2', isPrincipal: false },
];

const PACE_OPTIONS: { value: Pace; icon: string; title: string }[] = [
  { value: 'slow', icon: '🐢', title: 'Lento' },
  { value: 'moderate', icon: '🚶', title: 'Moderado' },
  { value: 'fast', icon: '🐇', title: 'Rápido' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const saveProfile = useProfileStore((s) => s.save);
  const setTheme = useThemeStore((s) => s.setMode);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    name: '',
    age: '',
    heightCm: '',
    weightKg: '',
    targetWeightKg: '',
    includedMeals: ['breakfast', 'lunch', 'dinner'],
  });

  function patch(p: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    if (step === 0) {
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  }

  function selectAndAdvance<K extends keyof Draft>(key: K, value: Draft[K]) {
    patch({ [key]: value } as Partial<Draft>);
    next();
  }

  function toggleMeal(meal: MealSlot) {
    setDraft((d) => ({
      ...d,
      includedMeals: d.includedMeals.includes(meal)
        ? d.includedMeals.filter((m) => m !== meal)
        : [...d.includedMeals, meal],
    }));
  }

  async function finish() {
    const age = parseInt(draft.age, 10) || 25;
    const heightCm = parseFloat(draft.heightCm) || 170;
    const weightKg = parseFloat(draft.weightKg) || 70;
    const targetWeightKg = parseFloat(draft.targetWeightKg) || weightKg;
    const goal = draft.goal ?? 'maintain';
    const activityLevel = draft.activityLevel ?? 'sedentary';
    const lifestyle = draft.lifestyle ?? 'mostly_seated';
    const dietType = draft.dietType ?? 'recommended';
    const pace = draft.pace ?? 'moderate';

    const result = calculateCalorieTarget({
      sex: draft.sex,
      weightKg,
      heightCm,
      age,
      lifestyle,
      activityLevel,
      goal,
      pace,
      dietType,
    });

    const now = new Date().toISOString();
    await saveProfile({
      id: generateId(),
      name: draft.name || 'Mi Perfil',
      sex: draft.sex,
      age,
      heightCm,
      weightKg,
      goal,
      activityLevel,
      lifestyle,
      hasMedicalCondition: draft.hasMedicalCondition ?? false,
      dietType,
      dietaryPreference: draft.dietaryPreference ?? 'balanced',
      includedMeals: draft.includedMeals,
      targetWeightKg,
      pace,
      dailyCalorieTarget: result.calories,
      dailyMacroTargets: result.macros,
      themePreference: 'dark',
      onboardingCompletedAt: now,
      createdAt: now,
    });
    await progressRepository.upsert({
      id: generateId(),
      date: now,
      type: 'weight',
      value: weightKg,
      unit: 'kg',
    });
    setTheme('dark');
    router.replace('/(tabs)');
  }

  const sexOptions: { value: Sex; label: string }[] = [
    { value: 'female', label: 'Mujer' },
    { value: 'male', label: 'Hombre' },
    { value: 'other', label: 'Otro' },
  ];

  let calorieResult: ReturnType<typeof calculateCalorieTarget> | null = null;
  if (step === TOTAL_STEPS - 1) {
    calorieResult = calculateCalorieTarget({
      sex: draft.sex,
      weightKg: parseFloat(draft.weightKg) || 70,
      heightCm: parseFloat(draft.heightCm) || 170,
      age: parseInt(draft.age, 10) || 25,
      lifestyle: draft.lifestyle ?? 'mostly_seated',
      activityLevel: draft.activityLevel ?? 'sedentary',
      goal: draft.goal ?? 'maintain',
      pace: draft.pace ?? 'moderate',
      dietType: draft.dietType ?? 'recommended',
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 w-full md:max-w-lg md:mx-auto">
        <View className="px-4 pt-2">
          <View className="flex-row items-center gap-4 mb-2">
            <Pressable onPress={back} hitSlop={12}>
              <Text className="text-fg" style={{ fontSize: 22 }}>
                ←
              </Text>
            </Pressable>
            <View className="flex-1">
              <ProgressBar step={step + 1} totalSteps={TOTAL_STEPS} />
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8">
        {step === 0 && (
          <>
            <StepHeader icon="🏁" title="¿Cuál es tu objetivo?" subtitle="Calcularemos tus calorías necesarias para lograrlo" />
            {GOAL_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                description={opt.description}
                selected={draft.goal === opt.value}
                onPress={() => selectAndAdvance('goal', opt.value)}
              />
            ))}
          </>
        )}

        {step === 1 && (
          <>
            <StepHeader icon="📋" title="Sobre ti" subtitle="Esta información nos ayudará a calcular tus calorías objetivo" />
            <TextField label="Nombre" value={draft.name} onChangeText={(v) => patch({ name: v })} placeholder="Tu nombre" />
            <Text className="font-body-medium text-sm text-muted mb-2">Sexo</Text>
            <View className="flex-row gap-2 mb-4">
              {sexOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => patch({ sex: opt.value })}
                  className={`flex-1 items-center rounded-2xl border py-3 ${
                    draft.sex === opt.value ? 'bg-primary/15 border-primary' : 'bg-muted/30 border-border'
                  }`}
                >
                  <Text className="font-body-medium text-fg">{opt.label}</Text>
                </Pressable>
              ))}
            </View>
            <TextField label="Edad" value={draft.age} onChangeText={(v) => patch({ age: v })} placeholder="25" keyboardType="number-pad" suffix="años" />
            <TextField label="Altura" value={draft.heightCm} onChangeText={(v) => patch({ heightCm: v })} placeholder="170" keyboardType="decimal-pad" suffix="cm" />
            <TextField label="Peso" value={draft.weightKg} onChangeText={(v) => patch({ weightKg: v })} placeholder="70" keyboardType="decimal-pad" suffix="kg" />
            <PrimaryButton
              label="Continuar"
              onPress={next}
              disabled={!draft.name || !draft.sex || !draft.age || !draft.heightCm || !draft.weightKg}
            />
          </>
        )}

        {step === 2 && (
          <>
            <StepHeader icon="💪" title="¿Cuál es tu nivel de actividad?" subtitle="No te preocupes, puedes cambiarlo después" />
            {ACTIVITY_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                selected={draft.activityLevel === opt.value}
                onPress={() => selectAndAdvance('activityLevel', opt.value)}
              />
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <StepHeader icon="🚶" title="¿Cuál es tu estilo de vida?" subtitle="Solo toma en consideración tu movimiento diario, no tus entrenamientos." />
            {LIFESTYLE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                description={opt.description}
                selected={draft.lifestyle === opt.value}
                onPress={() => selectAndAdvance('lifestyle', opt.value)}
              />
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <StepHeader icon="➕" title="¿Tienes alguna condición médica?" />
            <OptionCard icon="⚠️" title="Sí" selected={draft.hasMedicalCondition === true} onPress={() => selectAndAdvance('hasMedicalCondition', true)} />
            <OptionCard icon="✅" title="No" selected={draft.hasMedicalCondition === false} onPress={() => selectAndAdvance('hasMedicalCondition', false)} />
          </>
        )}

        {step === 5 && (
          <>
            <StepHeader icon="🥣" title="¿Qué tipo de dieta prefieres?" />
            {DIET_TYPE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                description={opt.description}
                selected={draft.dietType === opt.value}
                onPress={() => selectAndAdvance('dietType', opt.value)}
              />
            ))}
          </>
        )}

        {step === 6 && (
          <>
            <StepHeader icon="🍽️" title="¿Cuál es tu preferencia alimentaria?" />
            {DIETARY_PREFERENCE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                description={opt.description}
                selected={draft.dietaryPreference === opt.value}
                onPress={() => selectAndAdvance('dietaryPreference', opt.value)}
              />
            ))}
          </>
        )}

        {step === 7 && (
          <>
            <StepHeader icon="🍱" title="¿Qué comidas deseas incluir?" />
            {MEAL_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.isPrincipal ? '🍽️' : '🍪'}
                title={opt.title}
                description={opt.isPrincipal ? 'Principal' : undefined}
                selected={draft.includedMeals.includes(opt.value)}
                onPress={() => toggleMeal(opt.value)}
              />
            ))}
            <PrimaryButton label="Continuar" onPress={next} disabled={draft.includedMeals.length === 0} />
          </>
        )}

        {step === 8 && (
          <>
            <StepHeader icon="🎯" title="Personaliza tu objetivo" subtitle="Último paso para conocer tus calorías y macros" />
            <TextField
              label="Peso objetivo"
              value={draft.targetWeightKg}
              onChangeText={(v) => patch({ targetWeightKg: v })}
              placeholder={draft.weightKg || '70'}
              keyboardType="decimal-pad"
              suffix="kg"
            />
            <Text className="font-body-medium text-sm text-muted mb-2 mt-2">Velocidad</Text>
            {PACE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                title={opt.title}
                selected={draft.pace === opt.value}
                onPress={() => patch({ pace: opt.value })}
              />
            ))}
            <PrimaryButton label="Crear Mi Plan" onPress={next} disabled={!draft.targetWeightKg || !draft.pace} />
          </>
        )}

        {step === 9 && calorieResult && (
          <>
            <View className="items-center pt-6 pb-4">
              <View className="w-16 h-16 rounded-full bg-accent items-center justify-center">
                <Text className="text-white" style={{ fontSize: 28 }}>
                  ✓
                </Text>
              </View>
              <Text className="font-display-bold text-2xl text-fg text-center mt-4">
                ¡Genial! Estas son las calorías que necesitas al día
              </Text>
            </View>

            <View className="bg-muted/30 border border-border rounded-2xl p-6 items-center">
              <Text className="font-display-bold text-fg" style={{ fontSize: 32 }}>
                {calorieResult.calories.toLocaleString()} kcal
              </Text>
              <View className="flex-row items-center w-full justify-between mt-4">
                <Text className="font-body text-muted text-sm">{calorieResult.calorieRangeMin.toLocaleString()}</Text>
                <Text className="font-body text-muted text-sm">{calorieResult.calorieRangeMax.toLocaleString()}</Text>
              </View>
              <View className="h-1.5 w-full rounded-full bg-accent/30 -mt-1">
                <View className="h-1.5 rounded-full bg-accent" style={{ width: '50%' }} />
              </View>

              <View className="flex-row w-full justify-between mt-6">
                <View className="items-center flex-1">
                  <Text className="font-body text-muted text-sm">Proteínas</Text>
                  <Text className="font-body-semibold text-fg text-lg mt-1">{calorieResult.macros.proteinG} g</Text>
                  <View className="h-1 w-12 rounded-full mt-2" style={{ backgroundColor: '#3B82F6' }} />
                </View>
                <View className="items-center flex-1">
                  <Text className="font-body text-muted text-sm">Carbos</Text>
                  <Text className="font-body-semibold text-fg text-lg mt-1">{calorieResult.macros.carbG} g</Text>
                  <View className="h-1 w-12 rounded-full mt-2" style={{ backgroundColor: '#F97316' }} />
                </View>
                <View className="items-center flex-1">
                  <Text className="font-body text-muted text-sm">Grasas</Text>
                  <Text className="font-body-semibold text-fg text-lg mt-1">{calorieResult.macros.fatG} g</Text>
                  <View className="h-1 w-12 rounded-full mt-2" style={{ backgroundColor: '#EAB308' }} />
                </View>
              </View>
            </View>

            <View className="mt-6">
              <PrimaryButton label="Comenzar" onPress={finish} />
            </View>
          </>
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
