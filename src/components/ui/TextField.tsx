import { Text, TextInput, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';

import { useThemeColors } from '@/theme/use-theme-colors';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  suffix?: string;
}

export function TextField({ label, value, onChangeText, placeholder, keyboardType, suffix }: TextFieldProps) {
  const colors = useThemeColors();

  return (
    <View className="mb-4">
      <Text className="font-body-medium text-sm text-muted mb-2">{label}</Text>
      <View className="flex-row items-center bg-muted/30 border border-border rounded-2xl px-4">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          className="flex-1 py-4 font-body text-base text-fg"
        />
        {suffix ? <Text className="font-body text-base text-muted">{suffix}</Text> : null}
      </View>
    </View>
  );
}
