export const requireFields = (payload: Record<string, unknown>, fields: string[]) => {
  const missing = fields.filter((field) => payload[field] === undefined || payload[field] === null);
  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

