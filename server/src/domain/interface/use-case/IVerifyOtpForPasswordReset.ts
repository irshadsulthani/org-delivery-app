// src/domain/interface/use-case/IVerifyOtpForPasswordReset.ts

export interface IVerifyOtpForPasswordReset {
    execute(email: string, enteredOtp: number): Promise<void>;
}
  