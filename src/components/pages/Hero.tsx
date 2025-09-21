"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  chakra,
  useStyleConfig,
} from "@chakra-ui/react";
// import React from 'react'
import { ChevronRightIcon } from "@chakra-ui/icons";

export default function Hero() {
  const containerStyles = useStyleConfig("Container");
  const textStyles = useStyleConfig("Text");
  const svgWidths = ["140px", "140px", "233px", "293px"];

  return (
    <Box
      w="100%"
      bgSize="cover"
      bgPosition="right"
      display="flex"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        maxW="1170px"
        w="100%"
        bgSize="cover"
        bgPosition="right"
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          width={["310px", "397px", "397px", "397px"]}
          height="29px"
          borderRadius="25px"
          background="#E9E3FF"
          alignItems="center"
          mb="19px"
          justifyContent="center"
          columnGap="10px"
        >
          <Text
            color="#603CFF"
            // fontFamily="Plus Jakarta Sans"
            fontSize={["10px", "11px", "12px", "14px"]}
            fontStyle="normal"
            fontWeight="500"
            lineHeight="21px"
          >
            {" "}
            Introducing Horizon AI Template - Learn more about it
          </Text>
          <Box as={ChevronRightIcon} color="#603CFF" boxSize={4} />
        </Flex>
        <Flex direction="column">
          <Text
            color="#120F43"
            textAlign="center"
            // fontFamily='plus_Jakarta_Sans'
            fontSize={["24px", "32px", "40px", "58px"]}
            lineHeight={["28px", "36px", "44px", "68px"]}
            fontStyle="normal"
            fontWeight="700"
            letterSpacing="-0.5px"
          >
            Create outstanding AI SaaS
          </Text>

          <Box
            color="#120F43"
            textAlign="center"
            // fontFamily="Plus Jakarta Sans"
            fontSize={["24px", "32px", "40px", "58px"]}
            lineHeight={["28px", "36px", "44px", "68px"]}
            fontStyle="normal"
            fontWeight="700"
            letterSpacing="-0.5px"
            position="relative"
            //   mb='9.69px'
          >
            Apps & Prompts 10X faster
            <Box
              position="absolute"
              bottom="-1"
              right="0"
              w="100%"
              maxWidth={["110px", "150px", "190px", "283px"]}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="8.618"
                viewBox="0 0 293 8.618"
                fill="none"
                width={svgWidths.join(", ")}
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

          {/* <Box as="section" __css={containerStyles}>
      <Text __css={textStyles}  color="#120F43"
      textAlign="center"
          fontSize={['24px', '32px', '40px', '58px']}
          lineHeight={['28px', '36px', '44px', '68px']} 
      fontStyle="normal"
      fontWeight="700"
              letterSpacing="-0.5px"
              width={[ '140px', '233px','730px']}

            >
        Create outstanding AI SaaS Apps & Prompts{' '}
        <chakra.span className="highlight">10X faster</chakra.span>
      </Text>
            <Flex className="svg-container" alignItems="center"
              width={[ '140px', '233px','293px']}
>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          height="8.618"
          viewBox="0 0 293 8.618"
              fill="none"
        >
          <path
            fillRule="evenodd"
            clip-rule="evenodd"
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
      </Flex>
    </Box> */}
        </Flex>
        <Flex
          alignItems="center"
          mt="12.69px"
          justifyContent="center"
          flexDirection="column"
        >
          <Text
            color="#4A5568"
            textAlign="center"
            // fontFamily="Plus Jakarta Sans"
            fontSize={["12px", "14px", "16px", "18px"]}
            lineHeight={["16px", "18px", "24px", "30px"]}
            fontStyle="normal"
            fontWeight="500"
            maxWidth="590px"
          >
            {" "}
            Start building your AI SaaS Prompts apps with Horizon AI Template,
            the trendiest ChatGPT Admin Template for React, NextJS and Chakra
            UI!
          </Text>
        </Flex>
        <Flex columnGap="14px" mt="40px">
          <Button
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="-0.485px"
            borderRadius="45px"
            width={["120px", "150px", "180px", "210px"]}
            height={["40px", "40px", "40px", "54px"]}
            fontSize={["12px", "14px", "16px", "18px"]}
            background="linear-gradient(4deg, #4A25E1 26.30%, #7B5AFF 86.40%)"
            color="white"
            fontWeight="bold"
            // fontFamily="Plus Jakarta Sans"
            _hover={{
              background:
                "linear-gradient(4deg, #421FCC 26.30%, #6E52E8 86.40%)",
            }}
          >
            Get started now
          </Button>
          <Button
            display="flex"
            minWidth="40px"
            justifyContent="center"
            alignItems="center"
            gap="-0.485px"
            borderRadius="45px"
            border="1px solid #CBD5E0"
            color="#4A5568"
            fontWeight="bold"
            // fontFamily="Plus Jakarta Sans"
            width={["120px", "150px", "180px", "210px"]}
            height={["40px", "40px", "40px", "54px"]}
            fontSize={["12px", "14px", "16px", "18px"]}
            _hover={{
              background: "linear-gradient(4deg, white 26.30%, #F3F4F6 86.40%)",
            }}
          >
            See live preview{" "}
          </Button>
        </Flex>
        <Flex alignItems="center" mt="70px">
          <Image src="chatGPT.png" alt="" />
          <Box
            width="1px"
            height="20px"
            mr="14px"
            ml="10px"
            background="rgba(135, 140, 189, 0.30)"
          />
          <Text
            color="#4A5568"
            // fontFamily="Plus Jakarta Sans"
            fontSize={["12px", "12px", "14px", "16px"]}
            fontStyle="normal"
            fontWeight="500"
            lineHeight="30px"
          >
            Production-ready prompts
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

// export default Hero
