export interface UserContextType {
  token: string | null;
  name: string | null;
  email: string | null;
  setToken: (token: string | null) => void;
  setName: (name: string | null) => void;
  setEmail: (email: string | null) => void;
}
