import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from '../types';

const TOKEN_KEY = 'ai-tutor/tokens';

export const tokenStorage = {
  async save(tokens: AuthTokens) {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },
  async get(): Promise<AuthTokens | null> {
    const value = await AsyncStorage.getItem(TOKEN_KEY);
    return value ? (JSON.parse(value) as AuthTokens) : null;
  },
  async clear() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};
