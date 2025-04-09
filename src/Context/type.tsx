export interface UserContextType {
  token: string | null;
  role: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  setToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
  setName: (name: string | null) => void;
  setEmail: (email: string | null) => void;
  setImage: (image: string | null) => void;
}
