import React from "react";
import {
  Card,
  CardHeader,
  Text,
  CardBody,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { activities } from "@/utils/constants";

const ActivityTimeline = () => {
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const lineColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Card p="1rem" maxHeight="100%" borderRadius="20px" mb="20px">
      <CardHeader pt="0px" p="28px 0px 35px 21px">
        <Flex direction="column">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="10px"
            mb="4px"
          >
            Activity Timeline
          </Text>
        </Flex>
      </CardHeader>
      <CardBody ps="26px" pe="0px" mb="31px" position="relative">
        <Flex direction="column" gap="20px">
          {activities.map((activity, index) => {
            const isLast = index === activities.length - 1;
            return (
              <Flex key={index} position="relative">
                <Flex
                  direction="column"
                  alignItems="center"
                  mr={4}
                  width="20px"
                >
                  <Box
                    w="8px"
                    h="8px"
                    bg="red.500"
                    borderRadius="50%"
                    zIndex={1}
                    mt="8px"
                  />
                  {!isLast && (
                    <Box
                      position="absolute"
                      top="22px"
                      left="9px"
                      width="2px"
                      height="100%"
                      bg={lineColor}
                      borderRadius="1px"
                    />
                  )}
                </Flex>
                <Flex direction="column" flex={1}>
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Text
                      fontSize="md"
                      color={textColorPrimary}
                      fontWeight="bold"
                    >
                      {activity.title}
                    </Text>
                    <Text
                      fontSize="sm"
                      color={textColorSecondary}
                      fontWeight="normal"
                    >
                      {activity.time}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color={textColorSecondary}
                    fontWeight="normal"
                    mt={1}
                  >
                    {activity.description}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ActivityTimeline;
