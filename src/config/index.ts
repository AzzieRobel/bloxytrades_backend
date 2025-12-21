export const config = {
    port: Number(process.env.PORT) || 3000,
    mongodbUri: process.env.MONGODB_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    // Resend Email Configuration
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@bloxytrades.com',
    resendFromName: process.env.RESEND_FROM_NAME || 'BloxyTrades',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    emailVerificationTokenExpiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN || '24h',
};