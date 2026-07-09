import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  rightSlot?: ReactNode;
}

export function PrimaryButton({ label, onPress, disabled, rightSlot }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 px-6 ${
        disabled ? 'bg-primary/40' : 'bg-primary active:opacity-85'
      }`}
    >
      <Text className="font-body-semibold text-base text-white">{label}</Text>
      {rightSlot}
    </Pressable>
  );
}
