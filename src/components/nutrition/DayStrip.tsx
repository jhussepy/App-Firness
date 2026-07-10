import { Pressable, Text, View } from 'react-native';

import { isSameDay, parseLocalISODate, toLocalISODate, todayISODate } from '@/lib/date';

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

interface DayStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  loggedDates: Set<string>;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

export function DayStrip({ selectedDate, onSelectDate, loggedDates }: DayStripProps) {
  const start = startOfWeek(parseLocalISODate(selectedDate));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = todayISODate();

  return (
    <View className="flex-row justify-between mb-4">
      {days.map((d) => {
        const iso = toLocalISODate(d);
        const isSelected = isSameDay(iso, selectedDate);
        const isToday = isSameDay(iso, today);
        return (
          <Pressable key={iso} onPress={() => onSelectDate(iso)} className="items-center gap-1">
            <Text className="font-body text-muted text-xs">{DAY_LABELS[d.getDay()]}</Text>
            <View
              className={`w-9 h-9 rounded-full items-center justify-center ${
                isSelected ? 'bg-primary' : isToday ? 'border border-primary' : ''
              }`}
            >
              <Text className={`font-body-semibold ${isSelected ? 'text-white' : 'text-fg'}`}>{d.getDate()}</Text>
            </View>
            <View
              className={`w-1.5 h-1.5 rounded-full ${loggedDates.has(iso) ? 'bg-accent' : 'bg-transparent'}`}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
