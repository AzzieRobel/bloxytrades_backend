export const emailConfig = {
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendFromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@bloxytrades.com',
    resendFromName: process.env.RESEND_FROM_NAME || 'BloxyTrades',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    emailVerificationTokenExpiresIn: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN || '24h',
    secrete_key: process.env.SECRET_KEY || "my_super_secret_key_32bytes"
}