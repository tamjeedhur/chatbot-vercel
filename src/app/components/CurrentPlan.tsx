import React from "react";
import { Box, Flex, Text, Button, useColorModeValue } from "@chakra-ui/react";

const CurrentPlan = () => {
  const bgColor = useColorModeValue("#ffffff", "navy.700");
  const textColorSecondary = "gray.400";
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  return (
    <Box width="100%" bg={bgColor} pt={8} px={8} pb={16} borderRadius="20px" mt={8}>
     <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb={6}
  
      >
        Current Plan
      </Text>
      <Flex justifyContent="space-between" gap={{ base: 8, md: 16, lg: 20 }} flexWrap="wrap" pl={{md:4}}>
        <Flex
          direction="column"
          gap={3}
          flexGrow="1"
        >
          <Flex direction="column" gap={1}>
            <Text color={textColorPrimary} fontWeight="bold" fontSize="lg">
              Your current plan is Basic
            </Text>
            <Text as="p" color={textColorSecondary}>
              A simple start for everyone
            </Text>
          </Flex>
          <Flex direction="column" gap={1}>
            <Text color={textColorPrimary} fontWeight="bold" fontSize="lg">
              Active until Dec 09, 2025
            </Text>
            <Text as="p" color={textColorSecondary}>
              We will send you notification on subscription expiry
            </Text>
          </Flex>
          <Flex direction="column" gap={1}>
            <Text color={textColorPrimary} fontWeight="bold" fontSize="lg">
              $199 Per Month{" "}
              <Text as="span" color="blue.500" ml={2}>
                Popular
              </Text>
            </Text>
            <Text as="p" color={textColorSecondary}>
              Standard plan for small to medium businesses
            </Text>
            <Flex gap={4} mt={4} wrap="wrap">
              {/* First Button: Solid Blue */}
              <Button variant="brand">UPGRADE PLAN</Button>
             
              <Button
                variant="outline"
                color="gray.500"
                borderColor="gray.500"
              >
                CANCEL SUBSCRIPTION
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="column" gap={10} flexGrow="1">
          <Box bg="blue.100" width="100%" py={5} px={4} color="blue.500" borderRadius="20px">
            <Text fontWeight="bold">We need your attention</Text>
            <Text as="p">Your plan requires an upgrade</Text>
          </Box>
          <Box>
            <Flex justifyContent="space-between">
              <Text as="p" color={textColorSecondary}>
                Days
              </Text>
              <Text as="p" color={textColorSecondary}>
                24 of 30 days left
              </Text>
            </Flex>
            <Box>
              <Box
                height={2}
                bg={textColorSecondary}
                borderRadius="10px"
                width="100%"
              >
                <Box height="100%" width="80%" bg="blue.500" borderRadius="10px"></Box>
              </Box>
            </Box>
            <Text as="p" color={textColorSecondary}>
              6 days remaining until your plan requires an update
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CurrentPlan;
