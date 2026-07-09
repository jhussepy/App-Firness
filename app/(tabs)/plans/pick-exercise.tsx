import { useRouter } from 'expo-router';

import { ExercisePickerList } from '@/components/workout/ExercisePickerList';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useRoutineDraftStore } from '@/stores/routine-draft.store';

export default function PickExerciseForRoutineScreen() {
  const router = useRouter();
  const addExercise = useRoutineDraftStore((s) => s.addExercise);

  function selectExercise(exerciseId: string) {
    addExercise(exerciseId);
    router.back();
  }

  return (
    <Screen>
      <ScreenHeader title="Elige un ejercicio" />
      <ExercisePickerList onSelect={selectExercise} />
    </Screen>
  );
}
