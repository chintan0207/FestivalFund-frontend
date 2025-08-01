export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}
