export interface User {
  id: string;
  name?: string;
  email?: string;
  createdAt: number;
  lastActive: number;
  preferences: Record<string, any>;
}

export interface UserSession {
  userId: string;
  createdAt: number;
  lastActive: number;
  active: boolean;
}