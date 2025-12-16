export const sendEmail = async (to: string, subject: string, body: string) => {
  return { to, subject, body, queuedAt: new Date().toISOString() };
};

