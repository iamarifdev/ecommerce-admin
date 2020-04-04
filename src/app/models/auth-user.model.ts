export interface AuthUser {
  username: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  userId: string;
  fullName: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken: string;
}
