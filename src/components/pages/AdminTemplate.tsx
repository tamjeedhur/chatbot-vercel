"use client";

import React from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  Button,
  SimpleGrid,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

function AdminTemplate() {
  const svgWidths = ["140px", "140px", "233px", "293px"];

  return (
    <Box
      maxWidth="1170px"
      mb="90px"
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
        lineHeight={["16px", "18px", "22px", "24px"]}
        letterSpacing={["0px", "0px", "1px", "2px"]}
        fontStyle="normal"
        fontWeight="700"
        mb="10px"
      >
        HORIZON AI TEMPLATE MAIN FEATURES
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
          The ChatGPT Admin Template
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
          that you always searched for.
          <Box
            position="absolute"
            bottom="-1"
            right="13%"
            maxWidth={["110px", "150px", "190px", "270px"]}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={svgWidths.join(", ")}
              height="7.9415px"
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
        mt="18.03px"
        justifyContent="center"
        flexDirection="column"
        maxWidth="954px"
        mb="20px"
      >
        <Text
          color="#4A5568"
          textAlign="center"
          // fontFamily="Plus Jakarta Sans"
          fontSize={["12px", "14px", "16px", "18px"]}
          lineHeight={["16px", "18px", "24px", "30px"]}
          fontStyle="normal"
          fontWeight="500"
        >
          We apologize for letting you search for the most powerful and
          best-looking AI Template all of this time, we're trying to make
          Horizon AI Template more visible to many wonderful people like you,
          but we're glad you finally found it!
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        maxWidth="700px"
        width="100%"
        mb="50px"
      >
        <Text
          color="#A0AEC0"
          textAlign="center"
          // fontFamily="Plus Jakarta Sans"
          fontStyle="normal"
          fontWeight="500"
          fontSize={["10px", "12px", "13px", "14px"]}
          lineHeight={["16px", "18px", "24px", "30px"]}
        >
          (yeah, we know that it sounds a little bit over the top 😆... ok,
          let’s start diving into some serious stuff)
        </Text>
      </Flex>

      <Grid
        templateRows={{ md: "repeat(1, 1fr)", xl: "repeat(2, 1fr)" }}
        templateColumns={{
          md: "repeat(1, 1fr)",
          lg: "repeat(2, 1fr)",
          xl: "repeat(2, 1fr)",
        }}
        gap={7}
        mb="90px"
        alignContent="start"
        className="lg-xl-height"
      >
        <GridItem height="100%" maxHeight="318px">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            maxWidth="570px"
            w="100%"
            height="100%"
            maxHeight="318px"
            borderRadius="16px"
            background="#FFF"
            boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
            p=" 43px 20px 57px 20px"
          >
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontSize={["32px", "40px", "60px", "80px"]}
              lineHeight={["32px", "40px", "60px", "80px"]}
              fontStyle="normal"
              fontWeight="800"
              letterSpacing="-0.5px"
              bgGradient="linear-gradient(81deg, #3D1DFF 13.04%, #6147FF 38.28%, #D451FF 59.31%, #EC458D 80.35%)"
              bgClip="text"
              color="transparent"
              display="inline-block"
              mb="15px"
            >
              <Flex columnGap="5px">
                {" "}
                100 <Flex>+</Flex>
              </Flex>
            </Flex>
            <Flex
              mb="9px"
              color="#120F43"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontSize={["14px", "16px", "18px", "20px"]}
              lineHeight={["16px", "18px", "24px", "30px"]}
              fontStyle="normal"
              fontWeight="700"
            >
              Components & Elements
            </Flex>
            <Text
              color="#4A5568"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontSize={["12px", "12px", "14px", "16px"]}
              lineHeight={["16px", "18px", "24px", "28px"]}
              fontStyle="normal"
              fontWeight="500"
              maxWidth="305px"
            >
              Meticulously crafted buttons, inputs, badges, cards, and so on,
              giving you the freedom of choosing and combining.
            </Text>
          </Box>
        </GridItem>
        <GridItem rowSpan={2}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            maxWidth="570px"
            w="100%"
            maxHeight="846px"
            h="100%"
            borderRadius="16px"
            background="#FFF"
            boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
            p=" 43px 0px 0px 0px"
          >
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontSize={["32px", "40px", "60px", "80px"]}
              lineHeight={["32px", "40px", "60px", "80px"]}
              fontStyle="normal"
              fontWeight="800"
              letterSpacing="-0.5px"
              bgGradient="linear-gradient(81deg, #3D1DFF 13.04%, #6147FF 38.28%, #D451FF 59.31%, #EC458D 80.35%)"
              bgClip="text"
              color="transparent"
              display="inline-block"
              mb="15px"
            >
              <Flex columnGap="5px">
                {" "}
                33 <Flex>+</Flex>
              </Flex>
            </Flex>
            <Flex
              mb="9px"
              color="#120F43"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontSize={["14px", "16px", "18px", "20px"]}
              lineHeight={["16px", "18px", "24px", "30px"]}
              fontStyle="normal"
              fontWeight="700"
            >
              Fully coded example Pages{" "}
            </Flex>
            <Text
              color="#4A5568"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontSize={["12px", "12px", "14px", "16px"]}
              lineHeight={["16px", "18px", "24px", "28px"]}
              mb="26px"
              fontStyle="normal"
              fontWeight="500"
              maxWidth="361px"
            >
              Bunch of fully coded desktop & mobile page examples like
              Templates, Prompt Page, Chat UI, Profile Settings, and so on.
            </Text>
            <Button
              display="flex"
              width={["120px", "130px", "150px", "174px"]}
              height={["40px", "40px", "40px", "54px"]}
              justifyContent="center"
              alignItems="center"
              borderRadius="45px"
              background="linear-gradient(152deg, #FAFAFB 8.07%, #D4DBE4 58.44%, #FDFDFD 100%)"
              border="none"
              color="#4A5568"
              fontWeight="500"
              mb="51px"
              _hover={{
                background:
                  "linear-gradient(152deg, #D4DBE4 8.07%, #FAFAFB 58.44%, #FDFDFD 100%)",
              }}
            >
              <Text
                color="#120F43"
                textAlign="center"
                // fontFamily="Plus Jakarta Sans"
                fontSize={["10px", "12px", "13px", "14px"]}
                fontStyle="normal"
                fontWeight="600"
                lineHeight="16.8px"
              >
                See all pages live
              </Text>
            </Button>
            <Image
              borderBottomLeftRadius="16px"
              borderBottomRightRadius="16px"
              src="adminTemplateImage.png"
              alt=""
            />
          </Box>
        </GridItem>
        <GridItem>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            maxWidth="570px"
            w="100%"
            maxHeight="498px"
            h="100%"
            borderRadius="16px"
            background="#FFF"
            boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
            p=" 64px 20px 65px 20px"
          >
            <Image width="184px" height="112px" src="speedMeter.png" alt="" />
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontStyle="normal"
              fontWeight="800"
              fontSize={["40px", "50px", "75px", "100px"]}
              lineHeight={["32px", "40px", "60px", "80px"]}
              letterSpacing="-0.5px"
              bgGradient="linear-gradient(81deg, #3D1DFF 13.04%, #6147FF 38.28%, #D451FF 59.31%, #EC458D 80.35%)"
              bgClip="text"
              mt="20px"
              color="transparent"
              display="inline-block"
              mb="14px"
            >
              <Flex columnGap="5px">
                {" "}
                10 <Flex>X</Flex>
              </Flex>
            </Flex>
            <Flex
              mb="9px"
              color="#120F43"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontSize={["14px", "16px", "18px", "20px"]}
              lineHeight={["16px", "18px", "24px", "30px"]}
              fontStyle="normal"
              fontWeight="700"
            >
              Faster than other AI Templates{" "}
            </Flex>
            <Text
              color="#4A5568"
              textAlign="center"
              // fontFamily="Plus Jakarta Sans"
              fontStyle="normal"
              fontWeight="500"
              fontSize={["12px", "12px", "14px", "16px"]}
              lineHeight={["16px", "18px", "24px", "28px"]}
              maxWidth="365px"
            >
              Optimized with the latest technologies, Horizon instantly responds
              to almost any action you take while building your web app.
            </Text>
          </Box>
        </GridItem>
      </Grid>
      <Flex columnGap="13.6px">
        <Button
          display="flex"
          width={["120px", "140px", "150px", "169px"]}
          height={["40px", "40px", "40px", "54px"]}
          fontSize={["10px", "12px", "13px", "14px"]}
          justifyContent="center"
          alignItems="center"
          borderRadius="45px"
          background="linear-gradient(152deg, #FAFAFB 8.07%, #D4DBE4 58.44%, #FDFDFD 100%)"
          border="none"
          color="#4A5568"
          fontWeight="500"
          _hover={{
            background:
              "linear-gradient(152deg, #D4DBE4 8.07%, #FAFAFB 58.44%, #FDFDFD 100%)",
          }}
        >
          <Text
            color="#120F43"
            textAlign="center"
            // fontFamily="Plus Jakarta Sans"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="16.8px"
          >
            See live preview
          </Text>
        </Button>
        <Button
          display="flex"
          width={["120px", "150px", "180px", "210px"]}
          height={["40px", "40px", "40px", "54px"]}
          justifyContent="center"
          fontSize={["10px", "12px", "13px", "14px"]}
          alignItems="center"
          gap="-0.485px"
          borderRadius="45px"
          background="linear-gradient(4deg, #4A25E1 26.30%, #7B5AFF 86.40%)"
          color="white"
          fontWeight="bold"
          // fontFamily="Plus Jakarta Sans"
          _hover={{
            background: "linear-gradient(4deg, #421FCC 26.30%, #6E52E8 86.40%)",
          }}
        >
          <Text>Get started now</Text> <ChevronRightIcon />
        </Button>
      </Flex>
      <Flex
        color="#4A5568"
        textAlign="center"
        // fontFamily="Plus Jakarta Sans"

        fontStyle="normal"
        fontWeight="500"
        fontSize={["10px", "12px", "13px", "14px"]}
        lineHeight={["12px", "14px", "18px", "21px"]}
        mt="20px"
      >
        🧐 Still not decided?... Well, let us help you to make the right
        decision.
      </Flex>
    </Box>
  );
}

export default AdminTemplate;
