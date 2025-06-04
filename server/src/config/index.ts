import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  pass_key: process.env.PASS_KEY,
  pass_email: process.env.PASS_EMAIL,
  frontendUrl: process.env.FRONTEND_URL,
  accessTokenExpiration: Number(process.env.ACCESS_TOKEN_EXPIRATION),
  refreshTokenExpiration: Number(process.env.REFRESH_TOKEN_EXPIRATION),
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  cloudName:process.env.CLOUDINARY_CLOUD_NAME,
  cloudApiKey:process.env.CLOUDINARY_API_KEY,
  cloudApiSecret:process.env.CLOUDINARY_API_SECRET,
  awsAccessKeyId:process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion:process.env.AWS_REGION,
  awsBucket:process.env.AWS_S3_BUCKET,
  nodeEnv:process.env.ENV,
  clusterUri:process.env.CLUSTER_URI,
  stripeKey: process.env.STRIPE_SECRET_KEY,
};
