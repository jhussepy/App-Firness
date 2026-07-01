import { useEffect, useState } from 'react';
import { Text } from 'react-native';

interface SessionTimerProps {
  startedAt: string;
}

export function SessionTimer({ startedAt }: SessionTimerProps) {
  const [elapsedSec, setElapsedSec] = useState(() => Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSec(Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const minutes = Math.floor(elapsedSec / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (elapsedSec % 60).toString().padStart(2, '0');

  return (
    <Text className="font-display-bold text-fg" style={{ fontSize: 20 }}>
      {minutes}:{seconds}
    </Text>
  );
}
