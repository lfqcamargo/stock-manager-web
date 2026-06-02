export interface User {
  id: string;
  name: string;
  email: string;
  photoId?: string | null;
  createdAt: string;
  lastLogin: string | null;
}
