export const config = {
    port: Number(process.env.PORT) || 3000,
    mongodbUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
};