export interface User {
  userId: string;
  phone: string;
  role: string;
  eiin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
