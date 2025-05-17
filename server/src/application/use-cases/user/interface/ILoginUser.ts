
export interface ILoginUser {
  execute(
    email: string,
    password: string,
    allowedRoles: string[]
  ): Promise<{
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }>;
}
