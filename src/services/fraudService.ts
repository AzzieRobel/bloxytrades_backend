export const evaluateRisk = async (payload: Record<string, unknown>) => {
  const score = Math.random();
  return { score, flagged: score > 0.8, details: payload };
};

