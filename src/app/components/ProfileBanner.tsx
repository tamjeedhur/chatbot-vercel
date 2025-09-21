import { Box, Flex, Text, Avatar } from "@chakra-ui/react";

const ProfileBanner = () => {
  return (
    <Box
      w="100%"
      h={{ base: "250px", md: "350px" }}
      bgGradient="linear(to-r, blue.500, cyan.500)"
      position="relative"
      borderRadius="15px"
      overflow="hidden"
      
    >
      <Flex
        justify="flex-start"
        align="center"
        w="100%"
        px={{ base: "4" }}
        zIndex="1"
        position="absolute"
        bottom="0"
        left="0"
        gap={4}
        bg="#fefdf2"
        borderRadius="15px"
        backdropFilter="blur(10px)"
        py='10px'
      >
        <Flex direction="column" gap={2} ml={180}>
          <Text
            as="h1"
            fontSize={{ base: "sm", md: "lg" }}
            color="#D3748"
            fontWeight={600}
          >
            Code Analytics
          </Text>
          <Flex gap="15px">
            <Text as="p" fontSize="16px" color="#D3748" fontWeight={600}>
              Lahore
            </Text>
            <Text as="p" fontSize="16px" color="#D3748" fontWeight={600}>
              Pakistan
            </Text>
            <Text as="p" fontSize="16px" color="#D3748" fontWeight={600}>
              Planet Earth
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Avatar
        name="Your Name"
        src="../imgs/avatar4.png"
        position="absolute"
        bottom="3px"
        width="160px"
        height="160px"
        borderRadius="50%"
        left="20px"
        zIndex="2"
        border="5px solid gray"
      />
    </Box>
  );
};

export default ProfileBanner;
