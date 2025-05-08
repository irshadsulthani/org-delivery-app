//src/infrastructure/services/generateOtp.ts

export const GenerateOtp = (): number => {
    return Math.floor(1000 + Math.random() * 9000); 
  };
  
  export const GenerateOtpWithExpiry = () => {
    const otp = GenerateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    return { otp, expiresAt };
  };
  