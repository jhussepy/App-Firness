import { Pressable, Text, View } from 'react-native';

interface OptionCardProps {
  icon: string;
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function OptionCard({ icon, title, description, selected, onPress }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-2xl border px-4 py-4 mb-3 active:opacity-80 ${
        selected ? 'bg-primary/15 border-primary' : 'bg-muted/30 border-border'
      }`}
    >
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <View className="flex-1">
        <Text className="font-body-semibold text-base text-fg">{title}</Text>
        {description ? <Text className="font-body text-sm text-muted mt-0.5">{description}</Text> : null}
      </View>
      {selected ? (
        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
          <Text className="text-white font-body-semibold" style={{ fontSize: 14 }}>
            ✓
          </Text>
        </View>
      ) : (
        <View className="w-6 h-6 rounded-full border border-border" />
      )}
    </Pressable>
  );
}
