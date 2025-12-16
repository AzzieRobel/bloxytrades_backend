import { addHours } from '../utils/timeUtils';
import { APP_CONFIG } from '../config/appConfig';

export const placeInEscrow = async (orderId: string) => {
  return {
    orderId,
    releaseAt: addHours(new Date(), APP_CONFIG.escrowHoldHours)
  };
};

export const releaseEscrow = async (orderId: string) => {
  return { orderId, released: true, releasedAt: new Date().toISOString() };
};

