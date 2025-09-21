"use client";

import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";

function Productivity() {
  const svgWidths = ["140px", "140px", "233px", "350px"];

  return (
    <Box
      maxWidth="1170px"
      mt="89px"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
    >
      <Text
        color="#603CFF"
        textAlign="center"
        // fontFamily="Plus Jakarta Sans"
        fontStyle="normal"
        fontWeight="700"
        fontSize={["12px", "12px", "14px", "16px"]}
        lineHeight={["16px", "18px", "24px", "30px"]}
        letterSpacing={["0px", "0px", "1px", "2px"]}
        mb="10px"
      >
        PAGES AND COMPONENTS OVERVIEW
      </Text>
      <Flex direction="column">
        <Box
          color="#120F43"
          textAlign="center"
          // fontFamily="Plus Jakarta Sans"

          fontStyle="normal"
          fontWeight="800"
          fontSize={["24px", "32px", "40px", "58px"]}
          lineHeight={["28px", "36px", "44px", "70px"]}
          letterSpacing="-0.5px"
          position="relative"
        >
          Boost your productivity with
          <Box
            position="absolute"
            bottom={["-2"]}
            right="19%"
            maxWidth={["138px", "187px", "233px", "350px"]}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgWidths.join(", ")}
              height="10.2px"
              viewBox="0 0 293 8.618"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M290.665 9.30283C178.567 2.32702 52.4434 6.39683 3.42122 9.30337C1.93725 9.39135 0.653548 8.39946 0.553995 7.08792C0.454441 5.77638 1.57674 4.64184 3.06071 4.55385C52.2284 1.63868 178.616 -2.44191 291.043 4.5544C292.528 4.64672 293.646 5.78454 293.541 7.09579C293.437 8.40703 292.15 9.39516 290.665 9.30283Z"
                fill="url(#paint0_linear_3_18765)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_3_18765"
                  x1="27.4356"
                  y1="8.20491"
                  x2="226.431"
                  y2="-98.2359"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3D1DFF" />
                  <stop offset="0.223953" stopColor="#6147FF" />
                  <stop offset="0.46354" stopColor="#D451FF" />
                  <stop offset="0.750004" stopColor="#EC458D" />
                  <stop offset="1" stopColor="#FFCA8B" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </Box>

        <Text
          color="#120F43"
          textAlign="center"
          // fontFamily="Plus Jakarta Sans"
          fontSize={["24px", "32px", "40px", "58px"]}
          lineHeight={["28px", "36px", "44px", "70px"]}
          fontStyle="normal"
          fontWeight="800"
          letterSpacing="-0.5px"
        >
          ready to use Dark / Light pages{" "}
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        mt="31px"
        justifyContent="center"
        flexDirection="column"
        maxWidth="812px"
      >
        <Text
          color="#4A5568"
          textAlign="center"
          fontStyle="normal"
          fontSize={["12px", "14px", "16px", "18px"]}
          lineHeight={["16px", "18px", "24px", "30px"]}
          fontWeight="500"
        >
          We know you're tired of wasting thousands of hours of coding & design
          starting from scratch on your AI projects, we've thought of everything
          so you don't have to.
        </Text>
      </Flex>
      <SimpleGrid
        mt="80px"
        mb="90px"
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={5}
      >
        <Flex
          w="277.5px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          borderRadius="20px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Templates (User)
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="one.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Prompt Page (User)
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="two.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              History Page (User){" "}
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="three.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Usage Page (User){" "}
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="four.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Profile Settings (User)
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="five.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              My Projects (User){" "}
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="six.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Chat UI Page (User){" "}
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="seven.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Chat UI + Result (User){" "}
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="eight.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              My Plan Page (User){" "}
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="nine.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              All Templates (Admin)
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="ten.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              New Template (Admin)
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="eleven.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Edit Template (Admin)
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twelve.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Users Overview (Admin)
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="thirteen.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Sign In Page
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="fourteen.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Register Page
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="fifteen.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Essay Generator
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="eassyGenerator.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Content Simplifier
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="sixteen.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Product Description
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="seventeen.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Email Enhancer
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="eighteen.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              LinkedIn Message
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="nineteen.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Instagram Caption
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twenty.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              FAQs Content
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentyone.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Product Name
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentytwo.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              SEO Keywords
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentythree.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Review Responder
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentyfour.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Business Idea
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentyfive.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Article Generator
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentysix.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Plagiarism Checker
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentyseven.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Hashtags Generator
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentyeight.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Pet Name Generator
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="twentynine.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Content Translator
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="thirty.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              Domain Name Generator
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="thirtyone.png"
              alt=""
            />
          </Box>
        </Flex>
        <Flex
          borderRadius="20px"
          boxShadow="0px 16.16990089416504px 34.205501556396484px 0px rgba(203, 213, 224, 0.30)"
          direction="column"
          width="277.5px"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            padding="18px"
            background="#EDF2F7"
            borderTopLeftRadius="20px"
            borderTopRightRadius="20px"
          >
            <Box display="flex" columnGap="6px">
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />{" "}
              <Image w="10px" h="10px" src="iconContainer.png" alt="" />
            </Box>
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="21px"
            >
              {" "}
              Bootstrap to Tailwind Converter
            </Text>
            <Image
              color="#120F43"
              w="16px"
              h="16px"
              src="externalLink.png"
              alt=""
            />
          </Flex>
          <Box>
            <Image
              objectFit="contain"
              background="#F3F5F8"
              borderBottomLeftRadius="20px"
              borderBottomRightRadius="20px"
              src="thirtytwo.png"
              alt=""
            />
          </Box>
        </Flex>
      </SimpleGrid>
    </Box>
  );
}

export default Productivity;
