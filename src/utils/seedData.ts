import { listingDataAccess, userDataAccess } from '../data-access';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { generateReferralCode } from './referral';

// Mockup data that looks like real Limiteds (unique names, prices, quantities, and payment combos)
const mockListings = [
  {
    itemName: "Dominus Astra",
    quantity: 2,
    price: { USD: 30550 },
    acceptedPayments: { stripe: true, paypal: false, crypto: true },
    estimatedDeliveryTime: 12,
    isActive: true,
  },
  {
    itemName: "Rainbow Shaggy",
    quantity: 1,
    price: { USD: 16500 },
    acceptedPayments: { stripe: true, paypal: true, crypto: false },
    estimatedDeliveryTime: 6,
    isActive: true,
  },
  {
    itemName: "Valkyrie Helm",
    quantity: 5,
    price: { USD: 8700 },
    acceptedPayments: { stripe: false, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "PLAYFUL VAMPIRE",
    quantity: 3,
    price: { USD: 4100 },
    acceptedPayments: { stripe: true, paypal: false, crypto: false },
    estimatedDeliveryTime: 7,
    isActive: true,
  },
  {
    itemName: "Dominus Empyreus",
    quantity: 1,
    price: { USD: 85000 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 4,
    isActive: true,
  },
  {
    itemName: "Blackvalk",
    quantity: 2,
    price: { USD: 39500 },
    acceptedPayments: { stripe: false, paypal: true, crypto: false },
    estimatedDeliveryTime: 18,
    isActive: true,
  },
  {
    itemName: "Blue Sparkle Time Fedora",
    quantity: 1,
    price: { USD: 15700 },
    acceptedPayments: { stripe: true, paypal: false, crypto: true },
    estimatedDeliveryTime: 10,
    isActive: true,
  },
  {
    itemName: "Red Tango",
    quantity: 2,
    price: { USD: 6700 },
    acceptedPayments: { stripe: true, paypal: true, crypto: false },
    estimatedDeliveryTime: 10,
    isActive: true,
  },
  {
    itemName: "Purple Indie",
    quantity: 3,
    price: { USD: 1500 },
    acceptedPayments: { stripe: false, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Classic Fedora",
    quantity: 10,
    price: { USD: 3600 },
    acceptedPayments: { stripe: true, paypal: true, crypto: false },
    estimatedDeliveryTime: 19,
    isActive: true,
  },
  {
    itemName: "Brighteyes' Top Hat",
    quantity: 5,
    price: { USD: 2100 },
    acceptedPayments: { stripe: false, paypal: true, crypto: false },
    estimatedDeliveryTime: 8,
    isActive: true,
  },
  {
    itemName: "Midnight Blue Sparkle Time Fedora",
    quantity: 2,
    price: { USD: 20999 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 17,
    isActive: true,
  },
  {
    itemName: "Red Domino Crown",
    quantity: 1,
    price: { USD: 58000 },
    acceptedPayments: { stripe: true, paypal: false, crypto: true },
    estimatedDeliveryTime: 3,
    isActive: true,
  },
  {
    itemName: "Green Sparkle Time Fedora",
    quantity: 4,
    price: { USD: 12600 },
    acceptedPayments: { stripe: false, paypal: true, crypto: true },
    estimatedDeliveryTime: 19,
    isActive: true,
  },
  {
    itemName: "Ghostwalker",
    quantity: 8,
    price: { USD: 420 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 30,
    isActive: true,
  },
  {
    itemName: "Antlers of the Federation",
    quantity: 2,
    price: { USD: 6700 },
    acceptedPayments: { stripe: false, paypal: false, crypto: true },
    estimatedDeliveryTime: 14,
    isActive: true,
  },
  {
    itemName: "Yum!",
    quantity: 2,
    price: { USD: 6100 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 9,
    isActive: true,
  },
  {
    itemName: "Supa Dupa Fly Cap",
    quantity: 6,
    price: { USD: 580 },
    acceptedPayments: { stripe: false, paypal: false, crypto: true },
    estimatedDeliveryTime: 11,
    isActive: true,
  },
];

// Seed user for listings (will be created if doesn't exist)
const SEED_USER_EMAIL = 'seed-seller@bloxytrade.com';
const SEED_USER_USERNAME = 'seed_seller';

async function getOrCreateSeedUser() {
  // Try to find existing seed user
  let seedUser = await userDataAccess.findOne({ email: SEED_USER_EMAIL } as any);
  
  if (!seedUser) {
    // Create seed user if it doesn't exist
    const passwordHash = await bcrypt.hash('seed-password-123', 10);
    const userId = uuidv4();
    const referralCode = generateReferralCode();
    
    seedUser = await userDataAccess.create({
      id: userId,
      username: SEED_USER_USERNAME,
      email: SEED_USER_EMAIL,
      passwordHash,
      referralCode,
      isVerifiedSeller: true,
    } as any);
    
    console.log(`Created seed user: ${seedUser.id} (${seedUser.username})`);
  }
  
  return seedUser;
}

export async function seedListings() {
  try {
    // Check if any listings already exist (not just seed listings)
    const existingListings = await listingDataAccess.find({} as any);
    
    if (existingListings && existingListings.length > 0) {
      console.log('Listings already exist in database. Skipping seed operation.');
      return;
    }

    console.log('No listings found. Seeding database with mockup data...');

    // Get or create seed user
    const seedUser = await getOrCreateSeedUser();
    const sellerId = seedUser.id;

    // Create listings with unique IDs and proper user ID as sellerId
    const listingsToCreate = mockListings.map((listing) => ({
      id: uuidv4(),
      sellerId: sellerId,
      ...listing,
    }));

    // Insert all listings
    let successCount = 0;
    for (const listing of listingsToCreate) {
      try {
        await listingDataAccess.create(listing);
        successCount++;
      } catch (error: any) {
        // Skip if listing already exists (duplicate key error)
        if (error.code !== 11000) {
          console.error('Error creating listing:', error);
        }
      }
    }

    console.log(`Successfully seeded ${successCount} out of ${listingsToCreate.length} listings`);
  } catch (error) {
    console.error('Error seeding listings:', error);
  }
}
