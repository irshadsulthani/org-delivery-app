export interface ISendOtpForPasswordReset {
    execute(email: string): Promise<{ otp: string; expiresAt: Date }>;
}
  