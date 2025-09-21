"use client";

import { Box, Text, Flex, Image } from "@chakra-ui/react";
import React from "react";

function Dashboard() {
  const svgWidths = ["140px", "140px", "233px", "400px"];

  return (
    <Box
      maxWidth="1416px"
      mt="139px"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
    >
      <Text
        color="#603CFF"
        textAlign="center"
        // fontFamily="Plus Jakarta Sans"
        fontSize={["12px", "12px", "14px", "16px"]}
        fontStyle="normal"
        fontWeight="700"
        lineHeight="24px"
        width={["330px", "350px", "400px", "448px"]}
        letterSpacing={["0px", "0px", "1px", "2px"]}
        mb="10px"
      >
        CHATGPT OPENAI DASHBOARD AI TEMPLATE
      </Text>
      <Flex direction="column">
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
          The biggest time saver for
        </Text>

        <Box
          color="#120F43"
          textAlign="center"
          // fontFamily="Plus Jakarta Sans"
          fontSize={["24px", "32px", "40px", "58px"]}
          lineHeight={["28px", "36px", "44px", "70px"]}
          fontStyle="normal"
          fontWeight="800"
          letterSpacing="-0.5px"
          position="relative"
          //   mb='11.12px'
        >
          your AI web app project.
          <Box
            position="absolute"
            bottom={["-2", "-3", "-3", "-4"]}
            left="18%"
            maxWidth={["160px", "220px", "280px", "400px"]}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgWidths.join(", ")}
              height="11.765px"
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
      </Flex>
      <Flex
        alignItems="center"
        mt="18.69px"
        justifyContent="center"
        flexDirection="column"
        maxWidth="731px"
      >
        <Text
          color="#4A5568"
          textAlign="center"
          // fontFamily="Plus Jakarta Sans"
          fontStyle="normal"
          fontWeight="500"
          fontSize={["12px", "14px", "16px", "18px"]}
          lineHeight={["16px", "18px", "24px", "30px"]}
        >
          Based on Horizon UI Admin Template design guidelines, our new AI
          Template helps you create stunning AI SaaS web apps 10X faster than
          ever before.
        </Text>
      </Flex>
      <Box mb="70px">
        <Image src="dashboardGroup.png" alt="" />
      </Box>
    </Box>
  );
}

export default Dashboard;
