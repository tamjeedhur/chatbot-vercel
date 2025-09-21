"use client";
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Switch,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { PricingPlan } from "@/types/interfaces";


const pricingPlans: PricingPlan[] = [
  {
    name: "Basic",
    price: 0,
    description: "A simple start for everyone",
    features: [
      "100 responses a month",
      "Unlimited forms and surveys",
      "Unlimited fields",
      "Basic form creation tools",
      "Up to 2 subdomains",
    ],
    isActive: true,
  },
  {
    name: "Standard",
    price: 40,
    description: "For small to medium businesses",
    features: [
      "Unlimited responses",
      "Unlimited forms and surveys",
      "Instagram profile page",
      "Google Docs integration",
      'Custom "Thank you" page',
    ],
    isPopular: true,
    isActive: false,
  },
  {
    name: "Enterprise",
    price: 80,
    description: "Solution for big organisations",
    features: [
      "PayPal payments",
      "Logic jumps",
      "File upload with 5GB storage",
      "Custom domain support",
      "Stripe integration",
    ],
  },
];



const PricingPlans: React.FC<{ offPercent?: number }> = ({ offPercent = 15 }) => {
  const [isAnnual, setIsAnnual] = React.useState(false);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bgColor = useColorModeValue("#ffffff", "navy.700");
  const cardBg = useColorModeValue("#ffffff", "navy.800");
  const blueColor = "blue.500";
  

  const getDiscountedMonthlyPrice = (price: number): number => {
    if (isAnnual && price > 0) {
      const annualPrice = price * 12;
      const discountedAnnualPrice = annualPrice * (1 - offPercent / 100);
      return discountedAnnualPrice / 12;
    }
    return price;
  };

  const getAnnualSavings = (price: number): number => {
    if (isAnnual && price > 0) {
      const fullAnnualPrice = price * 12;
      const discountedAnnualPrice = fullAnnualPrice * (1 - offPercent / 100);
      return fullAnnualPrice - discountedAnnualPrice;
    }
    return 0;
  };

  const getBilledAnnualPrice = (price: number): number => {
    if (isAnnual && price > 0) {
      return price * 12 * (1 - offPercent / 100);
    }
    return price * 12;
  };

  return (
    <Box width="100%" pt={{ md: "100px", lg: "150px" }} bg={bgColor} pb={16} borderRadius="20px">
      <VStack spacing={8}>
        <VStack spacing={2}>
          <Heading color={textColorPrimary} mb={10}>
            Pricing Plans
          </Heading>
          <Text color={textColorSecondary}>
            All plans include 40+ advanced tools and features to boost your product.
          </Text>
          <Text color={textColorSecondary}>
            Choose the best plan to fit your needs.
          </Text>
        </VStack>
        <HStack mb={12}>
          <Text>Monthly</Text>
          <Switch
            colorScheme="blue"
            isChecked={isAnnual}
            onChange={() => setIsAnnual(!isAnnual)}
          />
          <Text>Annually</Text>
          <Text
            color="#ffff"
            bg={blueColor}
            px={2}
            py={1}
            borderRadius="md"
            fontSize="sm"
            fontWeight="normal"
          >
            Save up to {offPercent}%
          </Text>
        </HStack>
        <Flex width="100%" justifyContent="center" flexWrap="wrap" gap={4}>
          {pricingPlans.map((plan) => {
            // Apply popular styles to active card and simple styles to popular card
            const borderColor = plan.isActive
              ? blueColor
              : plan.isPopular
              ? "gray.200"
              : "gray.200";

            const buttonVariant = plan.isActive
              ? "brand" // Active cards get the popular (brand) button style
              : plan.isPopular
              ? "lightBrand" // Popular cards get the regular (lightBrand) button style
              : "lightBrand";

            const buttonColorScheme = plan.isActive
              ? "blue"
              : plan.isPopular
              ? "gray" // Popular cards get the regular color scheme
              : "gray";

            return (
              <Box
                key={plan.name}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="20px"
                p={6}
                position="relative"
                bg={cardBg}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                {/* Always display Popular chip for popular cards */}
                {plan.isPopular && !plan.isActive && (
                  <Text
                    position="absolute"
                    top={2}
                    right={6}
                    bg="blue.500"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="normal"
                  >
                    Popular
                  </Text>
                )}
                <VStack alignItems="flex-start" spacing={4} flexGrow={1}>
                  <Heading size="md">{plan.name}</Heading>
                  <Text>{plan.description}</Text>

                  <Flex width="100%" alignItems="center" gap={3} flexWrap="wrap">
                    <Heading size="lg" fontWeight="bold" fontSize="2xl">
                      ${getDiscountedMonthlyPrice(plan.price).toFixed(2)}
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        / Month
                      </span>
                    </Heading>
                    {isAnnual && (
                      <Badge
                        colorScheme="blue"
                        variant="solid"
                        fontWeight="normal"
                        fontSize="sm"
                        px={2}
                        py={1}
                        visibility={plan.price > 0 ? "visible" : "hidden"}
                      >
                        Save ${getAnnualSavings(plan.price).toFixed(2)} annually
                      </Badge>
                    )}
                  </Flex>

                  {isAnnual && (
                    <Text
                      color={textColorSecondary}
                      fontSize="sm"
                      visibility={plan.price > 0 ? "visible" : "hidden"}
                    >
                      Billed annually: ${getBilledAnnualPrice(plan.price).toFixed(2)}
                    </Text>
                  )}

                  <VStack alignItems="flex-start" spacing={2} mb={2}>
                    {plan.features.map((feature) => (
                      <HStack key={feature}>
                        <Icon as={CheckIcon} color={textColorSecondary} />
                        <Text color={textColorSecondary}>{feature}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
                <Button
                  colorScheme={buttonColorScheme}
                  variant={buttonVariant}
                  width="100%"
                  mt="auto"
                >
                  {plan.isActive ? "YOUR CURRENT PLAN" : "UPGRADE"}
                </Button>
              </Box>
            );
          })}
        </Flex>
      </VStack>
    </Box>
  );
};

export default PricingPlans;
