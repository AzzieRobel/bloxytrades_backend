import { listingDataAccess } from '../data-access';
import { v4 as uuidv4 } from 'uuid';

// Mockup data that matches the frontend structure
const mockListings = [
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24, // hours
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Super Super Happy Face",
    description: "A rare and valuable Roblox item. Perfect for collectors and traders.",
    quantity: 1,
    price: { USD: 939 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
];

// Default seller ID for seed data (you can change this or make it configurable)
const DEFAULT_SEED_SELLER_ID = 'seed-seller-001';

export async function seedListings() {
  try {
    // Check if any listings already exist (not just seed listings)
    const existingListings = await listingDataAccess.find({} as any);
    
    if (existingListings && existingListings.length > 0) {
      console.log('Listings already exist in database. Skipping seed operation.');
      return;
    }

    console.log('No listings found. Seeding database with mockup data...');

    // Create listings with unique IDs
    const listingsToCreate = mockListings.map((listing) => ({
      id: uuidv4(),
      sellerId: DEFAULT_SEED_SELLER_ID,
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

