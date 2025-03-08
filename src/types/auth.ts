
export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
}

export interface ClickPoint {
  x: number;
  y: number;
  imageId: string;
}

export interface AuthImage {
  id: string;
  url: string;
  alt: string;
}

export interface RegisterData {
  username: string;
  email: string;
  clickPoints: ClickPoint[];
}

export interface LoginData {
  email: string;
  clickPoints: ClickPoint[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}
