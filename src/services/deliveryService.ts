export const deliverRobux = async (orderId: string, amount: number) => {
  return { orderId, amount, delivered: true };
};

export const deliverLimited = async (orderId: string, assetId: string) => {
  return { orderId, assetId, delivered: true };
};

