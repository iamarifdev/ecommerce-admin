export interface AuthUser {
  username: string;
  companyId?: string;
  roleId: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken: string;
}
