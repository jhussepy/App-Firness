import { Pressable, Text, View } from 'react-native';

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

interface ScheduleDayPickerProps {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}

export function ScheduleDayPicker({ selectedDays, onToggleDay }: ScheduleDayPickerProps) {
  return (
    <View className="flex-row justify-between">
      {DAY_LABELS.map((label, day) => {
        const selected = selectedDays.includes(day);
        return (
          <Pressable
            key={day}
            onPress={() => onToggleDay(day)}
            className={`w-10 h-10 rounded-full items-center justify-center border ${
              selected ? 'bg-primary border-primary' : 'bg-muted/30 border-border'
            }`}
          >
            <Text className={`font-body-semibold ${selected ? 'text-white' : 'text-muted'}`}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
