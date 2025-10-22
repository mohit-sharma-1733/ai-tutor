import { api } from './api';
import { AuthResponse } from '../types';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  name: string;
};

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  async getProfile() {
    const { data } = await api.get<AuthResponse['user']>('/auth/me');
    return data;
  },
};
