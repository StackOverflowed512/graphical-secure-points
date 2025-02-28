
export interface Password {
  id: string;
  userId: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePasswordData {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
}

export interface UpdatePasswordData extends Partial<CreatePasswordData> {
  id: string;
}

export interface PasswordContextType {
  passwords: Password[];
  loading: boolean;
  error: string | null;
  getPasswords: () => Promise<void>;
  addPassword: (data: CreatePasswordData) => Promise<void>;
  updatePassword: (data: UpdatePasswordData) => Promise<void>;
  deletePassword: (id: string) => Promise<void>;
}
