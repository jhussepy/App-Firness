import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, RotateCcw } from 'lucide-react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FoodScanError, foodScanErrorMessage, scanFoodPhoto, type FoodScanResult } from '@/lib/food-scan-client';
import { MEAL_LABEL } from '@/lib/nutrition-labels';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useProfileStore } from '@/stores/profile.store';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { MealSlot } from '@/data/models/user';

type Status = 'idle' | 'scanning' | 'result' | 'error';

export default function ScanFoodScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const profile = useProfileStore((s) => s.profile);
  const addCustomFood = useNutritionStore((s) => s.addCustomFood);
  const logFood = useNutritionStore((s) => s.logFood);

  const [status, setStatus] = useState<Status>('idle');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [result, setResult] = useState<FoodScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealSlot>(profile?.includedMeals?.[0] ?? 'breakfast');
  const [saving, setSaving] = useState(false);

  const meals = profile?.includedMeals ?? ['breakfast', 'lunch', 'dinner'];

  async function runScan(asset: ImagePicker.ImagePickerAsset) {
    setPhotoUri(asset.uri);
    setStatus('scanning');
    try {
      // Re-compress and cap the width before upload — on a slow connection
      // (reported failures traced back to ~0.5 kB/s uploads) a full-resolution
      // phone photo can take minutes to reach the server and time out well
      // before LogMeal ever sees it. 900px is plenty for food recognition.
      const needsResize = (asset.width ?? 0) > 900;
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        needsResize ? [{ resize: { width: 900 } }] : [],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      const base64 = manipulated.base64 ?? asset.base64 ?? '';
      const scanResult = await scanFoodPhoto(base64);
      setResult(scanResult);
      setStatus('result');
    } catch (err) {
      const code = err instanceof FoodScanError ? err.code : 'upstream_error';
      setErrorMessage(foodScanErrorMessage(code));
      setStatus('error');
    }
  }

  async function pickFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
    });
    if (!picked.canceled && picked.assets[0]) {
      await runScan(picked.assets[0]);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const taken = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });
    if (!taken.canceled && taken.assets[0]) {
      await runScan(taken.assets[0]);
    }
  }

  function reset() {
    setStatus('idle');
    setPhotoUri(null);
    setResult(null);
    setErrorMessage('');
  }

  async function confirmLog() {
    if (!result) return;
    setSaving(true);
    const food = await addCustomFood({
      name: result.foodName,
      servingLabel: 'Porción escaneada',
      caloriesPerServing: result.calories,
      proteinG: result.proteinG,
      carbG: result.carbG,
      fatG: result.fatG,
    });
    await logFood(food.id, selectedMeal, 1, date);
    setSaving(false);
    router.back();
  }

  return (
    <Screen>
      <ScreenHeader title="Escanear comida" />

      {status === 'idle' ? (
        <View className="items-center pt-8">
          <View className="w-24 h-24 rounded-full bg-primary/15 items-center justify-center mb-5">
            <Camera color={colors.primary} size={36} />
          </View>
          <Text className="font-body-semibold text-fg text-lg text-center mb-1">Toma una foto de tu plato</Text>
          <Text className="font-body text-muted text-sm text-center mb-8 px-4">
            Identificamos los alimentos y calculamos las calorías y macros automáticamente.
          </Text>
          <PrimaryButton
            label="Tomar foto"
            onPress={takePhoto}
            rightSlot={<Camera color="white" size={18} />}
          />
          <Pressable onPress={pickFromLibrary} className="flex-row items-center gap-2 mt-4 active:opacity-70">
            <ImageIcon color={colors.primary} size={18} />
            <Text className="font-body-semibold text-primary">Elegir de la galería</Text>
          </Pressable>
        </View>
      ) : null}

      {status === 'scanning' ? (
        <View className="items-center pt-8">
          {photoUri ? (
            <Image source={{ uri: photoUri }} className="w-full aspect-square rounded-2xl mb-5" resizeMode="cover" />
          ) : null}
          <ActivityIndicator color={colors.primary} size="large" />
          <Text className="font-body text-muted text-sm mt-4">Analizando tu comida...</Text>
        </View>
      ) : null}

      {status === 'error' ? (
        <View className="items-center pt-8">
          {photoUri ? (
            <Image source={{ uri: photoUri }} className="w-full aspect-square rounded-2xl mb-5" resizeMode="cover" />
          ) : null}
          <Text className="font-body text-fg text-center mb-6 px-4">{errorMessage}</Text>
          <PrimaryButton label="Intentar de nuevo" onPress={reset} rightSlot={<RotateCcw color="white" size={18} />} />
        </View>
      ) : null}

      {status === 'result' && result ? (
        <View className="pt-4">
          {photoUri ? (
            <Image source={{ uri: photoUri }} className="w-full aspect-square rounded-2xl mb-5" resizeMode="cover" />
          ) : null}

          <View className="bg-muted/30 border border-border rounded-2xl px-4 py-4 mb-4">
            <Text className="font-body-semibold text-fg text-lg mb-1">{result.foodName}</Text>
            <Text className="font-body text-muted text-sm mb-3">{result.calories} kcal</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="font-body text-muted text-xs">Proteínas</Text>
                <Text className="font-body-semibold text-fg mt-0.5">{result.proteinG} g</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="font-body text-muted text-xs">Carbos</Text>
                <Text className="font-body-semibold text-fg mt-0.5">{result.carbG} g</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="font-body text-muted text-xs">Grasas</Text>
                <Text className="font-body-semibold text-fg mt-0.5">{result.fatG} g</Text>
              </View>
            </View>
          </View>

          <Text className="font-body-medium text-sm text-muted mb-2">Agregar a</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {meals.map((meal) => (
              <Pressable
                key={meal}
                onPress={() => setSelectedMeal(meal)}
                className={`rounded-full px-4 py-2 border ${
                  selectedMeal === meal ? 'bg-primary border-primary' : 'bg-muted/30 border-border'
                }`}
              >
                <Text className={`font-body-medium text-sm ${selectedMeal === meal ? 'text-white' : 'text-fg'}`}>
                  {MEAL_LABEL[meal]}
                </Text>
              </Pressable>
            ))}
          </View>

          <PrimaryButton label={saving ? 'Guardando...' : 'Registrar'} onPress={confirmLog} disabled={saving} />
          <Pressable onPress={reset} className="items-center mt-3 active:opacity-70">
            <Text className="font-body-medium text-muted text-sm">Escanear otra foto</Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}
