export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: User;
  tokens: AuthTokens;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage?: string;
  unreadCount?: number;
};

export type Paginated<T> = {
  data: T[];
  nextCursor?: string | null;
};
