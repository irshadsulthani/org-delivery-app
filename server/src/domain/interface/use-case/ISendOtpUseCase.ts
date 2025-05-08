export interface ISendOtpUseCase {
    execute(email: string): Promise<{ otp: string; expiresAt: Date }>;
}
  