// Stripe Configuration - Update these with your actual Stripe Dashboard values

export const STRIPE_CONFIG = {
  // Test Mode (for development)
  test: {
    products: {
      free: {
        name: "Free Plan",
        priceId: "", // Free plan doesn't need a price ID
        productId: "", // Free plan doesn't need a product ID
        price: 0,
        interval: "month"
      },
      pro: {
        name: "Pro Plan",
        priceId: "price_1RurPhRbWIJTTgx14Og3PzK4",
        productId: "prod_SqYWqfHDtxCqqs", 
        price: 10,
        interval: "month"
      },
      enterprise: {
        name: "Enterprise Plan",
        priceId: "price_1RuqUtRbWIJTTgx1Kkanc52O",
        productId: "prod_SqXaC8lspFjdN1", 
        price: 15,
        interval: "month"
      }
    }
  },
  
  // Live Mode (for production)
  live: {
    products: {
      free: {
        name: "Free Plan",
        priceId: "",
        productId: "",
        price: 0,
        interval: "month"
      },
      pro: {
        name: "Pro Plan",
        priceId: "", // Replace with your live mode price ID
        productId: "", // Replace with your live mode product ID
        price: 29,
        interval: "month"
      },
      enterprise: {
        name: "Enterprise Plan",
        priceId: "", // Replace with your live mode price ID
        productId: "", // Replace with your live mode product ID
        price: 99,
        interval: "month"
      }
    }
  }
};

// Helper function to get the current environment config
export const getStripeConfig = () => {
  const isTestMode = process.env.NODE_ENV === 'development' || process.env.STRIPE_MODE === 'test';
  return isTestMode ? STRIPE_CONFIG.test : STRIPE_CONFIG.live;
};

// Helper function to get product config by plan ID
export const getProductConfig = (planId: string) => {
  const config = getStripeConfig();
  const productConfig = config.products[planId as keyof typeof config.products];
  return productConfig;
};

// Helper function to get price ID by plan ID
export const getPriceId = (planId: string): string => {
  const productConfig = getProductConfig(planId);
  const priceId = productConfig?.priceId || '';
  return priceId;
};

// Helper function to get product ID by plan ID
export const getProductId = (planId: string): string => {
  const productConfig = getProductConfig(planId);
  const productId = productConfig?.productId || '';
  return productId;
};
