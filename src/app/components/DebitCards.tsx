import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Heading,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { CardItemProps, CardData } from "@/types/interfaces";

// Define types for CardItem props


// CardItem component
const CardItem: React.FC<CardItemProps> = ({
  cardType,
  cardHolder,
  lastFour,
  expiry,
  isPrimary,
}) => {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const lineColor = useColorModeValue("gray.200", "gray.700");
  

  const cardImage =
    cardType === "mastercard"
      ? "../master.png" 
      : "/visa.png";

  return (
    <Box
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor={lineColor}
      width="100%"
    >
      <HStack justify="space-between" align="flex-start">
        <VStack align="flex-start" spacing={1}>
          <HStack>
            <Image
              src={cardImage}
              alt={cardType}
              width={cardType === "mastercard" ? "30px" : "40px"}
              height="20px"
            />
            <Text fontWeight="bold" fontSize="md" color={textColorPrimary}>
              {cardHolder}
            </Text>
            {/* Primary Badge */}
            {isPrimary && (
              <Text fontSize="xs" color="blue.500" fontWeight="semibold">
                Primary
              </Text>
            )}
          </HStack>
          <Text fontSize="sm" color={textColorSecondary}>
            •••• •••• •••• {lastFour}
          </Text>
        </VStack>

        {/* Right Side - Action Buttons and Expiry */}
        <VStack align="flex-end" spacing={1}>
          <HStack>
            <Button size='xs' variant="brand" px={4} py={3}>
              EDIT
            </Button>
            <Button
              size='xs'
              variant="lightBrand"
              px={4} 
              py={3} 
            >
              DELETE
            </Button>
          </HStack>
          {/* Expiry Date */}
          <Text fontSize="xs" color={textColorSecondary}>
            Card expires at {expiry}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

// Define the type for the card data


const MyCards: React.FC = () => {
  const cards: CardData[] = [
    {
      cardType: "mastercard",
      cardHolder: "Tom McBride",
      lastFour: "9865",
      expiry: "11/24",
      isPrimary: true,
    },
    {
      cardType: "visa",
      cardHolder: "Mildred Wagner",
      lastFour: "5678",
      expiry: "02/24",
      isPrimary: false,
    },
  ];
  const bgColor = useColorModeValue("#ffffff", "navy.900");
  return (
    <Box p={5} bg={bgColor} borderRadius="20px">
      <Heading size="md" mb={4}>
        My Cards
      </Heading>
      <VStack spacing={4} align="stretch">
        {cards.map((card, index) => (
          <CardItem
            key={index}
            cardType={card.cardType}
            cardHolder={card.cardHolder}
            lastFour={card.lastFour}
            expiry={card.expiry}
            isPrimary={card.isPrimary}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default MyCards;
