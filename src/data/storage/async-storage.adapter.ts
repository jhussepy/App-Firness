import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'app-firness/';

export async function readJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(PREFIX + key);
}
