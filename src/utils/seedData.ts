import { listingDataAccess } from '../data-access';
import { v4 as uuidv4 } from 'uuid';

// Mockup data that looks like real Limiteds (unique names, prices, descriptions, quantities, and payment combos)
const mockListings = [
  {
    itemName: "Dominus Astra",
    description: "Ultra-rare limited Roblox hat. Own a galaxy on your head.",
    quantity: 2,
    price: { USD: 30550 },
    acceptedPayments: { stripe: true, paypal: false, crypto: true },
    estimatedDeliveryTime: 12,
    isActive: true,
  },
  {
    itemName: "Rainbow Shaggy",
    description: "The legendary Rainbow Shaggy. Stand out in every crowd!",
    quantity: 1,
    price: { USD: 16500 },
    acceptedPayments: { stripe: true, paypal: true, crypto: false },
    estimatedDeliveryTime: 6,
    isActive: true,
  },
  {
    itemName: "Valkyrie Helm",
    description: "Classic and iconic Valkyrie Helm. True Robloxian status.",
    quantity: 5,
    price: { USD: 8700 },
    acceptedPayments: { stripe: false, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "PLAYFUL VAMPIRE",
    description: "Playful Vampire face. A classic expression for elite traders.",
    quantity: 3,
    price: { USD: 4100 },
    acceptedPayments: { stripe: true, paypal: false, crypto: false },
    estimatedDeliveryTime: 7,
    isActive: true,
  },
  {
    itemName: "Dominus Empyreus",
    description: "The most sought-after Dominus. Absolute flex for collectors.",
    quantity: 1,
    price: { USD: 85000 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 4,
    isActive: true,
  },
  {
    itemName: "Blackvalk",
    description: "Ultra-rare Blackvalk. Limited edition velvet style.",
    quantity: 2,
    price: { USD: 39500 },
    acceptedPayments: { stripe: false, paypal: true, crypto: false },
    estimatedDeliveryTime: 18,
    isActive: true,
  },
  {
    itemName: "Blue Sparkle Time Fedora",
    description: "Shine bright with the Blue Sparkle Time Fedora. Prestigious and flashy.",
    quantity: 1,
    price: { USD: 15700 },
    acceptedPayments: { stripe: true, paypal: false, crypto: true },
    estimatedDeliveryTime: 10,
    isActive: true,
  },
  {
    itemName: "Red Tango",
    description: "Attract attention with the rare Red Tango mask.",
    quantity: 2,
    price: { USD: 6700 },
    acceptedPayments: { stripe: true, paypal: true, crypto: false },
    estimatedDeliveryTime: 10,
    isActive: true,
  },
  {
    itemName: "Purple Indie",
    description: "Unique Indie shades for those who love purple.",
    quantity: 3,
    price: { USD: 1500 },
    acceptedPayments: { stripe: false, paypal: true, crypto: true },
    estimatedDeliveryTime: 24,
    isActive: true,
  },
  {
    itemName: "Classic Fedora",
    description: "OG Classic Fedora. A trader’s classic staple.",
    quantity: 10,
    price: { USD: 3600 },
    acceptedPayments: { stripe: true, paypal: true, crypto: false },
    estimatedDeliveryTime: 19,
    isActive: true,
  },
  {
    itemName: "Brighteyes' Top Hat",
    description: "Highly popular top hat, often seen on the best traders.",
    quantity: 5,
    price: { USD: 2100 },
    acceptedPayments: { stripe: false, paypal: true, crypto: false },
    estimatedDeliveryTime: 8,
    isActive: true,
  },
  {
    itemName: "Midnight Blue Sparkle Time Fedora",
    description: "Sparkle in Midnight Blue. Among the rarest fedoras.",
    quantity: 2,
    price: { USD: 20999 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 17,
    isActive: true,
  },
  {
    itemName: "Red Domino Crown",
    description: "Legendary Red Domino Crown, limited supply, huge demand.",
    quantity: 1,
    price: { USD: 58000 },
    acceptedPayments: { stripe: true, paypal: false, crypto: true },
    estimatedDeliveryTime: 3,
    isActive: true,
  },
  {
    itemName: "Green Sparkle Time Fedora",
    description: "Vivid green sparkle on a classic fedora.",
    quantity: 4,
    price: { USD: 12600 },
    acceptedPayments: { stripe: false, paypal: true, crypto: true },
    estimatedDeliveryTime: 19,
    isActive: true,
  },
  {
    itemName: "Ghostwalker",
    description: "Ghostwalker sword. Perfect for sword fighting games.",
    quantity: 8,
    price: { USD: 420 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 30,
    isActive: true,
  },
  {
    itemName: "Antlers of the Federation",
    description: "Majestic silver antlers from the Federation series.",
    quantity: 2,
    price: { USD: 6700 },
    acceptedPayments: { stripe: false, paypal: false, crypto: true },
    estimatedDeliveryTime: 14,
    isActive: true,
  },
  {
    itemName: "Yum!",
    description: "YUM face—a favorite among traders.",
    quantity: 2,
    price: { USD: 6100 },
    acceptedPayments: { stripe: true, paypal: true, crypto: true },
    estimatedDeliveryTime: 9,
    isActive: true,
  },
  {
    itemName: "Supa Dupa Fly Cap",
    description: "Classic Supa Dupa cap. Always in style.",
    quantity: 6,
    price: { USD: 580 },
    acceptedPayments: { stripe: false, paypal: false, crypto: true },
    estimatedDeliveryTime: 11,
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
