export interface AuthResponse {
  token: string;
  user: { email: string; name: string };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface User {
  createdAt: Date;
  email: string;
  id: number;
  name: string;
  password: string;
  role: string;
  updatedAt: Date;
}
