"use client";

import { Box, Text, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";

function RightPlan() {
  const gridData = [
    {
      headImage: "/purple.png",
      heading: "Start-Ups",
      headingDesc: "(for one developer)",
      description:
        "A recommended single license for solo designers & developers building high-end AI projects & applications. ",
      packagePrice: "$79",
      packageDiscount: false,
      packagePayment: "one-time payment",
      packageTax: "VAT taxes included",
      button: "Get started now with Horizon AI",
      access: "Lifetime access. One-time payment. Free updates.",
      componentImageOne: "/purpleone.png",
      componentHeading: "100+ Components / elements",
      sub: "— dark/light",
      componentDescription:
        "individual elements, like buttons, inputs, navbars, cards, alerts, and so on... giving you the freedom of choosing and combining.",
      componentImageTwo: "/purpletwo.png",
      componentHeadingTwo: "12 Months premium support",
      subTwo: "— premium",
      componentDescriptionTwo:
        "support with high priority for any problems with Horizon AI Template, via Discord or contact mail.",
      componentImageThree: "/purplethree.png",
      componentHeadingThree: "One project",
      subThree: "— The personal license gives you",
      componentDescriptionThree:
        "permission to create one project with it. For unlimited projects, we recommend you to choose the Teams license.",
      enterprise: false,
    },

    {
      headImage: "/teams.png",
      heading: "Enterprise",
      headingDesc: "(up to 10 developers)",
      description:
        "  Perfect license for designers and developers teams working on company-level AI projects & applications.",
      packagePrice: "reg. $790",
      packageDiscount: true,
      packagePayment: "one-time payment",
      packageTax: "VAT taxes included",
      button: "Get started now for your team",
      access: "Lifetime access. One-time payment. Free updates.",
      componentImageOne: "/teamlogo.png",
      componentHeading: "Get access for your entire team",
      sub: "— team licenses",
      componentDescription:
        "include access for up to 10 people to accommodate even the largest teams at your company.",
      componentImageTwo: "/question.png",
      componentHeadingTwo: "12 Months premium support",
      subTwo: "— premium",
      componentDescriptionTwo:
        "support with high priority for any problems with Horizon AI Template, via Discord or contact mail.",
      componentImageThree: "/infinity.png",
      componentHeadingThree: "Unlimited projects",
      subThree: "— create as much projects you",
      componentDescriptionThree:
        "want with your team/company based on Horizon AI Template.",
      enterprise: true,
    },
    // {
    //   headImage:'/purple.png',
    //   heading: 'Custom',
    //   headingDesc:'(for one developer)',
    //   description: "A recommended single license for solo designers & developers building high-end AI projects & applications. ",
    //   packagePrice: '$79',
    //   packageDiscount: false,
    //   packagePayment: 'one-time payment',
    //   packageTax: 'VAT taxes included',
    //   button: 'Get started now with Horizon AI',
    //   access: 'Lifetime access. One-time payment. Free updates.',
    //   componentImageOne: '/purpleone.png',
    //   componentHeading: '100+ Components / elements',
    //   sub: '— dark/light',
    //   componentDescription: 'individual elements, like buttons, inputs, navbars, cards, alerts, and so on... giving you the freedom of choosing and combining.',
    //   componentImageTwo: '/purpletwo.png',
    //   componentHeadingTwo: '12 Months premium support',
    //   subTwo: '— premium',
    //   componentDescriptionTwo: 'support with high priority for any problems with Horizon AI Template, via Discord or contact mail.',
    //   componentImageThree: '/purplethree.png',
    //   componentHeadingThree: 'One project',
    //   subThree: '— The personal license gives you',
    //   componentDescriptionThree: 'permission to create one project with it. For unlimited projects, we recommend you to choose the Teams license.',
    //   enterprise: false,
    // },
  ];

  const svgWidths = ["110px", "150px", "185px", "272px"];

  return (
    <Box
      maxWidth="1170px"
      width="100%"
      display="flex"
      flexDirection="column"
      rowGap="30px"
    >
      <Flex direction="column" alignItems="center" justifyContent="center">
        <Text
          color="#603CFF"
          textAlign="center"
          // fontFamily="Plus Jakarta Sans"
          fontStyle="normal"
          fontWeight="700"
          fontSize={["12px", "12px", "14px", "16px"]}
          lineHeight={["16px", "18px", "20px", "24px"]}
          letterSpacing={["0px", "0px", "1px", "2px"]}
          mb="10px"
        >
          PRICING PLANS
        </Text>
        <Flex direction="column">
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
          >
            Choose the right plan for
            <Box
              position="absolute"
              bottom="-2"
              right="13%"
              maxWidth={["110px", "150px", "185px", "270px"]}
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
            fontStyle="normal"
            fontWeight="800"
            fontSize={["24px", "32px", "40px", "58px"]}
            lineHeight={["28px", "36px", "44px", "70px"]}
            letterSpacing="-0.5px"
          >
            you and your business{" "}
          </Text>
        </Flex>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
        >
          <Flex
            padding="28px"
            display="flex"
            borderRadius="16px"
            alignItems="center"
            justifyContent="center"
            mt="41px"
            minHeight="126px"
            h="100%"
            background="#FFF"
            maxW="636.9px"
            w="100%"
            boxShadow="14px 27px 45px 0px rgba(112, 144, 176, 0.18)"
          >
            <Flex
              display="flex"
              minHeight="70px"
              h="100%"
              justifyContent="space-around"
              maxW="579px"
              w="100%"
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
              borderRadius="14px"
              background="#FFF"
              columnGap="14px"
              boxShadow="14px 27px 45px 0px rgba(112, 144, 176, 0.18)"
            >
              <Flex display="flex" alignItems="center" columnGap="14px">
                {" "}
                <Image
                  w="34px"
                  h="34px"
                  objectFit="contain"
                  src="react.png"
                  alt=""
                />
                <Image w="18px" h="18px" src="plus.png" alt="" />
                <Image
                  w="34px"
                  h="34px"
                  objectFit="contain"
                  src="next.png"
                  alt=""
                />
                <Image w="18px" h="18px" src="plus.png" alt="" />
                <Image
                  w="34px"
                  h="34px"
                  objectFit="contain"
                  src="chakra.png"
                  alt=""
                />
                <Image w="18px" h="18px" src="plus.png" alt="" />
                <Image
                  w="34px"
                  h="34px"
                  objectFit="contain"
                  src="ts.png"
                  alt=""
                />
              </Flex>
              <Flex>
                {" "}
                <Text
                  color="#120F43"
                  //   fontFamily="Plus Jakarta Sans"
                  fontStyle="normal"
                  fontWeight="700"
                  fontSize={["12px", "14px", "16px", "18px"]}
                  lineHeight={["16px", "18px", "22px", "27px"]}
                  letterSpacing="-0.5px"
                >
                  {" "}
                  React + NextJS + Chakra UI + TS
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex
        width="100%"
        display="flex"
        padding={{ base: "15px", sm: "18px", md: "23px", lg: "33px" }}
        alignItems="center"
        // alignSelf="stretch"
        borderRadius="16px"
        border="1px solid #CBD5E0"
      >
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          w="100%"
          display="flex"
          alignItems={{ base: "start", md: "center" }}
          rowGap="10px"
          justifyContent="space-around"
        >
          <Flex direction="column">
            <Text
              color="#4A5568"
              //   fontFamily="Plus Jakarta Sans"
              fontStyle="normal"
              fontWeight="500"
              fontSize={["10px", "12px", "13px", "14px"]}
              lineHeight={["15px", "15px", "18px", "21px"]}
            >
              Demo version
            </Text>
            <Text
              color="#120F43"
              //   fontFamily="Plus Jakarta Sans"
              fontSize={["22px", "28px", "42px", "48px"]}
              lineHeight={["28px", "36px", "46px", "58px"]}
              fontStyle="normal"
              fontWeight="800"
            >
              Free
            </Text>
          </Flex>
          <Flex direction="column" rowGap="11px">
            <Text
              color="#120F43"
              //   fontFamily="Plus Jakarta Sans"
              fontSize={["12px", "12px", "14px", "16px"]}
              lineHeight={["16px", "18px", "20px", "24px"]}
              fontStyle="normal"
              fontWeight="700"
            >
              Open-source (MIT License)
            </Text>
            <Text
              color="#4A5568"
              //   fontFamily="Plus Jakarta Sans"
              fontStyle="normal"
              fontWeight="500"
              fontSize={["10px", "12px", "13px", "14px"]}
              lineHeight={["15px", "15px", "18px", "21px"]}
              maxWidth={{
                base: "390px",
                sm: "390px",
                md: "300px",
                lg: "390px",
              }}
            >
              An open-source demo version of Horizon AI Template for entry-level
              ChatGPT-based AI applications (Chat UI page).
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            borderRadius="12px"
            border="1px solid #CBD5E0"
            minW="98.64px"
            justifyContent="space-between"
          >
            <Flex
              alignItems="center"
              background="#E9EDF7"
              w="60.14px"
              borderTopLeftRadius="12px"
              borderBottomLeftRadius="12px"
              justifyContent="space-around"
              minHeight="23px"
            >
              <Image
                w="15px"
                h="14.25px"
                color="#120F43"
                src="star.png"
                alt=""
              />
              <Text
                color="#120F43"
                textAlign="center"
                //   fontFamily="Plus Jakarta Sans"
                fontStyle="normal"
                fontWeight="700"
                lineHeight={["10px", "11px", "12px", "12px"]}
                fontSize={["12px", "12px", "13.4px", "14.4px"]}
              >
                {" "}
                Star
              </Text>
            </Flex>
            <Flex alignItems="center" justifyContent="center" w="32px">
              <Text
                color="#120F43"
                textAlign="center"
                //   fontFamily="Plus Jakarta Sans"
                fontStyle="normal"
                fontWeight="600"
                lineHeight={["10px", "11px", "12px", "12px"]}
                fontSize={["12px", "12px", "13.4px", "14.4px"]}
              >
                116
              </Text>
            </Flex>
          </Flex>
          <Flex
            width={["100%", "100%", "180px", "200px"]}
            height={["40px", "40px", "40px", "54px"]}
            justifyContent="center"
            alignItems="center"
            gap="-0.57px"
            border="1px solid #CBD5E0"
            borderRadius="45px"
          >
            <Text
              color="#120F43"
              textAlign="center"
              //   fontFamily="Plus Jakarta Sans"
              fontStyle="normal"
              fontWeight="600"
              fontSize={["10px", "12px", "13px", "14px"]}
              lineHeight={["12px", "14px", "14px", "16.8px"]}
            >
              Get started for Free
            </Text>
            <Flex w="14px" h="14px">
              <ChevronRightIcon />
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Box w="100%" display="flex" alignItems="center" justifyContent="center">
        <SimpleGrid columns={{ lg: 2 }} spacing={7}>
          {gridData.map((data, index) =>
            data.enterprise ? (
              <Flex
                key={index}
                w="100%"
                // maxWidth='575px'
                p={{ base: "20px", sm: "24px", md: "32px", lg: "40px" }}
                borderRadius="16px"
                direction="column"
                rowGap="50px"
                // background="radial-gradient(70.71% 70.71% at 50% 50%, #B4B0FE 0%, #363285 22.92%, #110D5B 42.71%, #050327 88.54%)"
                background="#2C1166"
                boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
              >
                <Flex columnGap="28px">
                  <Image
                    w={["35px", "40px", "60px", "70px"]}
                    h={["35px", "40px", "60px", "70px"]}
                    src={data.headImage}
                    alt=""
                  />
                  <Flex direction="column" rowGap="6px">
                    <Flex
                      color="#FFF"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["12px", "12px", "14px", "16px"]}
                      lineHeight={["16px", "18px", "20px", "24px"]}
                      fontStyle="normal"
                      fontWeight="700"
                      display="flex"
                      alignItems="center"
                      columnGap="5px"
                    >
                      {data.heading}
                      <Text
                        color="#FFF"
                        //   fontFamily="Plus Jakarta Sans"
                        fontSize={["10px", "12px", "13px", "14px"]}
                        lineHeight={["15px", "15px", "18px", "21px"]}
                        fontStyle="normal"
                        fontWeight="500"
                      >
                        {data.headingDesc}
                      </Text>
                    </Flex>
                    <Text
                      color="#FFF"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                      maxWidth="375px"
                    >
                      {data.description}
                    </Text>
                  </Flex>
                </Flex>
                <Box>
                  <Flex
                    display="flex"
                    maxWidth="490px"
                    w="100%"
                    height="255px"
                    borderRadius="16px"
                    background="linear-gradient(180deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.06) 50.63%, rgba(255, 255, 255, 0.03) 100%)"
                    boxShadow="0px 8px 25px -4px rgba(255, 255, 255, 0.30) inset"
                    p={{
                      base: "22px 18px",
                      sm: "28px 24px",
                      md: "35px 30px",
                      lg: "40px 34px",
                    }}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Flex
                      display="flex"
                      flexDirection="row"
                      w="100%"
                      justifyContent="flex-end"
                    >
                      <Flex
                        display="flex"
                        flexDirection="row"
                        columnGap="20px"
                        mb="30px"
                      >
                        <Flex
                          //   fontFamily="Plus Jakarta Sans"
                          fontSize="16px"
                          fontStyle="normal"
                          fontWeight="800"
                          lineHeight="24px"
                          w="113px"
                          color="#FFF"
                          display="flex"
                          flexDirection="column"
                        >
                          {data.packagePrice}
                          {data.packageDiscount && (
                            <Text
                              color="#01B574"
                              //   fontFamily="Plus Jakarta Sans"
                              fontSize={["12px", "12px", "14px", "16px"]}
                              lineHeight={["16px", "18px", "20px", "24px"]}
                              fontStyle="normal"
                              fontWeight="500"
                            >
                              -76% discount
                            </Text>
                          )}{" "}
                        </Flex>
                        <Box
                          width="1px"
                          height="54px"
                          background="rgba(135, 140, 189, 0.30)"
                        />
                        <Flex
                          display="flex"
                          flexDirection="column"
                          color="#FFF"
                          //   fontFamily="Plus Jakarta Sans"
                          fontSize={["11px", "12px", "13px", "14px"]}
                          lineHeight={["12px", "15px", "18px", "21px"]}
                          fontStyle="normal"
                          fontWeight="700"
                        >
                          {data.packagePayment}
                          <Text
                            color="#CBD5E0"
                            //   fontFamily="Plus Jakarta Sans"
                            fontSize={["11px", "12px", "13px", "14px"]}
                            lineHeight={["12px", "15px", "18px", "21px"]}
                            fontStyle="normal"
                            fontWeight="500"
                          >
                            {data.packageTax}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <Flex
                      mb="18px"
                      display="flex"
                      maxH="52px"
                      minH="52px"
                      // padding="19px 90px 18px 90px"
                      justifyContent="center"
                      alignItems="center"
                      gap="-0.515px"
                      flex="1 0 0"
                      borderRadius="45px"
                      w="100%"
                      background="rgba(255, 255, 255, 0.14);
"
                    >
                      <Text
                        color="#FFF"
                        textAlign="center"
                        //   fontFamily="Plus Jakarta Sans"
                        fontSize={["10px", "12px", "13px", "14px"]}
                        lineHeight={["10px", "12px", "13px", "14px"]}
                        fontStyle="normal"
                        fontWeight="600"
                      >
                        {data.button}
                      </Text>
                      <Image src="arrowright.png" alt="" />
                    </Flex>
                    <Text
                      color="#CBD5E0"
                      textAlign="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                    >
                      {data.access}
                    </Text>
                  </Flex>

                  <Flex
                    width="100%"
                    maxWidth="490px"
                    height="2px"
                    margin="0 auto"
                    background="linear-gradient(90deg, rgba(14, 165, 233, 0.00) 0%, rgba(0, 224, 255, 0.00) 0.01%, #00E0FF 20.66%, #4318FF 52.95%, #FF18F6 83.16%, rgba(255, 24, 246, 0.00) 100%)"
                    filter="blur(2px)"
                  ></Flex>
                </Box>

                <Flex columnGap="20px">
                  <Image
                    w="32px"
                    h="29.5px"
                    src={data.componentImageOne}
                    alt=""
                  />
                  <Flex direction="column">
                    <Flex
                      display="flex"
                      color="#CBD5E0"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                    >
                      <Text
                        color="#FFF"
                        //   fontFamily="Plus Jakarta Sans"
                        fontSize={["12px", "12px", "14px", "16px"]}
                        lineHeight={["16px", "18px", "20px", "24px"]}
                        fontStyle="normal"
                        fontWeight="700"
                        whiteSpace="nowrap"
                      >
                        {data.componentHeading}
                      </Text>
                      {data.sub}
                    </Flex>

                    <Text
                      color="#CBD5E0"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                      maxWidth="404px"
                    >
                      {data.componentDescription}
                    </Text>
                  </Flex>
                </Flex>
                <Flex columnGap="20px">
                  <Image
                    w="32px"
                    h="29.5px"
                    src={data.componentImageTwo}
                    alt=""
                  />
                  <Flex direction="column">
                    <Flex
                      display="flex"
                      color="#CBD5E0"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                    >
                      <Text
                        color="#FFF"
                        //   fontFamily="Plus Jakarta Sans"
                        fontSize={["12px", "12px", "14px", "16px"]}
                        lineHeight={["16px", "18px", "20px", "24px"]}
                        fontStyle="normal"
                        fontWeight="700"
                        whiteSpace="nowrap"
                      >
                        {data.componentHeadingTwo}
                      </Text>
                      {data.subTwo}
                    </Flex>

                    <Text
                      color="#CBD5E0"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                      maxWidth="436px"
                    >
                      {data.componentDescriptionTwo}
                    </Text>
                  </Flex>
                </Flex>
                <Flex columnGap="20px">
                  <Image
                    w="40px"
                    h="20px"
                    src={data.componentImageThree}
                    alt=""
                  />
                  <Flex direction="column">
                    <Flex
                      display="flex"
                      color="#CBD5E0"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                    >
                      <Text
                        color="#FFF"
                        //   fontFamily="Plus Jakarta Sans"
                        fontStyle="normal"
                        fontWeight="700"
                        lineHeight="24px"
                        whiteSpace="nowrap"
                      >
                        {data.componentHeadingThree}
                      </Text>
                      {data.subThree}
                    </Flex>

                    <Text
                      color="#CBD5E0"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontSize={["12px", "12px", "14px", "16px"]}
                      lineHeight={["16px", "18px", "20px", "24px"]}
                      fontStyle="normal"
                      fontWeight="500"
                      maxWidth="340px"
                    >
                      {data.componentDescriptionThree}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              <Flex
                key={index}
                w="100%"
                // maxWidth='575px'
                p={{ base: "20px", sm: "24px", md: "32px", lg: "40px" }}
                borderRadius="16px"
                direction="column"
                rowGap="50px"
                background="#FFF"
                boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
              >
                <Flex columnGap="28px">
                  <Image
                    w={["35px", "40px", "60px", "70px"]}
                    h={["35px", "40px", "60px", "70px"]}
                    src="purple.png"
                    alt=""
                  />
                  <Flex direction="column" rowGap="6px">
                    <Flex
                      color="#120F43"
                      //   fontFamily="Plus Jakarta Sans"
                      fontStyle="normal"
                      fontWeight="700"
                      fontSize={["12px", "12px", "14px", "16px"]}
                      lineHeight={["16px", "18px", "20px", "24px"]}
                      alignItems="center"
                      columnGap="5px"
                    >
                      {data.heading}{" "}
                      <Text
                        color="#4A5568"
                        //   fontFamily="Plus Jakarta Sans"
                        fontSize={["10px", "12px", "13px", "14px"]}
                        lineHeight={["15px", "15px", "18px", "21px"]}
                        fontStyle="normal"
                        fontWeight="500"
                      >
                        {data.headingDesc}
                      </Text>
                    </Flex>
                    <Text
                      color="#4A5568"
                      //   fontFamily="Plus Jakarta Sans"
                      fontStyle="normal"
                      fontWeight="500"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      maxWidth="375px"
                    >
                      {data.description}
                    </Text>
                  </Flex>
                </Flex>
                <Box>
                  <Flex
                    display="flex"
                    // width={['120px', '150px', '180px', '210px']}
                    // height={['40px','40px','40px','54px']}
                    maxWidth="490px"
                    w="100%"
                    height="255px"
                    p={{
                      base: "22px 18px",
                      sm: "28px 24px",
                      md: "35px 30px",
                      lg: "40px 34px",
                    }}
                    //  p= "40px 34px"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="16px"
                    background="#F3F5FA"
                  >
                    <Flex columnGap="20px" mb="30px" alignItems="center">
                      <Text
                        //   fontFamily="Plus Jakarta Sans"
                        fontSize={["24px", "32px", "40px", "58px"]}
                        lineHeight={["24px", "32px", "40px", "58px"]}
                        fontStyle="normal"
                        fontWeight="800"
                        background="linear-gradient(129deg, #00E0FF 0%, #4318FF 50.21%, #FB18BC 78.60%)"
                        backgroundClip="text"
                      >
                        {data.packagePrice}
                      </Text>
                      <Box
                        width="1px"
                        height="54px"
                        background="rgba(135, 140, 189, 0.30)"
                      />
                      <Flex flexDirection="column" alignItems="center">
                        <Text
                          color="#120F43"
                          //   fontFamily="Plus Jakarta Sans"
                          fontSize={["10px", "12px", "13px", "14px"]}
                          lineHeight={["15px", "15px", "18px", "21px"]}
                          fontStyle="normal"
                          fontWeight="700"
                        >
                          {data.packagePayment}
                        </Text>
                        <Text
                          color="#4A5568"
                          //   fontFamily="Plus Jakarta Sans"
                          fontSize={["10px", "12px", "13px", "14px"]}
                          lineHeight={["15px", "15px", "18px", "21px"]}
                          fontStyle="normal"
                          fontWeight="500"
                        >
                          {data.packageTax}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex
                      mb="18px"
                      display="flex"
                      maxH="52px"
                      minH="52px"
                      minWidth="40px"
                      // padding="19px 90px 18px 90px"
                      justifyContent="center"
                      alignItems="center"
                      gap="-0.515px"
                      flex="1 0 0"
                      borderRadius="45px"
                      background="#120F43"
                      w="100%"
                    >
                      <Text
                        color="#FFF"
                        textAlign="center"
                        fontSize={["10px", "12px", "13px", "14px"]}
                        lineHeight={["10px", "12px", "13px", "14px"]}
                        fontStyle="normal"
                        fontWeight="600"
                      >
                        {data.button}
                      </Text>
                      <Image src="arrowright.png" alt="" />
                    </Flex>
                    <Text
                      color="#1A202C"
                      textAlign="center"
                      //   fontFamily="Plus Jakarta Sans"

                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                    >
                      {data.access}
                    </Text>
                  </Flex>

                  <Flex
                    width="100%"
                    maxWidth="490px"
                    height="2px"
                    margin="0 auto"
                    background="linear-gradient(90deg, rgba(14, 165, 233, 0.00) 0%, rgba(0, 224, 255, 0.00) 0.01%, #00E0FF 20.66%, #4318FF 52.95%, #FF18F6 83.16%, rgba(255, 24, 246, 0.00) 100%)"
                    filter="blur(2px)"
                  ></Flex>
                </Box>

                <Flex columnGap="20px">
                  <Image
                    w="32px"
                    h="29.5px"
                    src={data.componentImageOne}
                    alt=""
                  />
                  <Flex direction="column">
                    <Flex
                      display="flex"
                      color="#4A5568"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"

                      flexDirection="row"
                      fontStyle="normal"
                      fontWeight="500"
                      letterSpacing="0px"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                    >
                      <Text
                        color="#120F43"
                        fontSize={["12px", "12px", "14px", "16px"]}
                        lineHeight={["16px", "18px", "20px", "24px"]}
                        //   fontFamily="Plus Jakarta Sans"
                        fontStyle="normal"
                        fontWeight="700"
                        whiteSpace="nowrap"
                        // maxW={['230px', '230px', '230px', '230px']}
                        // w='100%'
                      >
                        {data.componentHeading}
                      </Text>
                      {data.sub}{" "}
                    </Flex>

                    <Text
                      color="#4A5568"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"

                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                      maxWidth="420px"
                    >
                      {" "}
                      {data.componentDescription}
                    </Text>
                  </Flex>
                </Flex>
                <Flex columnGap="20px">
                  <Image
                    w="32px"
                    h="29.5px"
                    src={data.componentImageTwo}
                    alt=""
                  />
                  <Flex direction="column">
                    <Flex
                      display="flex"
                      color="#4A5568"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"

                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                    >
                      <Text
                        color="#120F43"
                        fontSize={["12px", "12px", "14px", "16px"]}
                        lineHeight={["16px", "18px", "20px", "24px"]}
                        //   fontFamily="Plus Jakarta Sans"
                        fontStyle="normal"
                        fontWeight="700"
                        whiteSpace="nowrap"
                      >
                        {data.componentHeadingTwo}
                      </Text>
                      {data.subTwo}
                    </Flex>

                    <Text
                      color="#4A5568"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"
                      fontStyle="normal"
                      fontWeight="500"
                      maxWidth="436px"
                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                    >
                      {data.componentDescriptionTwo}
                    </Text>
                  </Flex>
                </Flex>
                <Flex columnGap="20px">
                  <Image
                    w="32px"
                    h="29.5px"
                    src={data.componentImageThree}
                    alt=""
                  />
                  <Flex direction="column">
                    <Flex
                      display="flex"
                      color="#4A5568"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"

                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                    >
                      <Text
                        color="#120F43"
                        //   fontFamily="Plus Jakarta Sans"
                        lineHeight={["16px", "18px", "20px", "24px"]}
                        fontStyle="normal"
                        fontWeight="700"
                        whiteSpace="nowrap"
                      >
                        {data.componentHeadingThree}
                      </Text>
                      {data.subThree}{" "}
                    </Flex>

                    <Text
                      color="#4A5568"
                      alignItems="center"
                      //   fontFamily="Plus Jakarta Sans"

                      fontSize={["10px", "12px", "13px", "14px"]}
                      lineHeight={["15px", "15px", "18px", "21px"]}
                      fontStyle="normal"
                      fontWeight="500"
                      maxWidth="431px"
                    >
                      {data.componentDescriptionThree}{" "}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            )
          )}
        </SimpleGrid>
      </Box>

      <Text
        color="#120F43"
        textAlign="center"
        //   fontFamily="Plus Jakarta Sans"
        fontStyle="normal"
        fontWeight="700"
        w="100%"
        fontSize={["12px", "14px", "16px", "18px"]}
        lineHeight={["16px", "18px", "24px", "27px"]}
      >
        Looking for unlimited? Invest $60 more and unlock unlimited
        possibilities with our Enterprise License! 👇
      </Text>

      <Box w="100%" display="flex" alignItems="center" justifyContent="center">
        <Flex
          width={["100%", "100%", "564px", "100%"]}
          padding="33px"
          flexDirection="column"
          alignItems="center"
          alignSelf="stretch"
          borderRadius="16px"
          background="#FFF"
          mb="140px"
          boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
        >
          <Flex
            width="100%"
            display="flex"
            alignItems={{ base: "start", lg: "center" }}
            rowGap="10px"
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent="space-between"
          >
            <Flex direction="column">
              <Flex
                color="#120F43"
                //   fontFamily="Plus Jakarta Sans"
                fontStyle="normal"
                fontWeight="700"
                fontSize={["12px", "12px", "14px", "16px"]}
                lineHeight={["16px", "18px", "20px", "24px"]}
                display="flex"
                alignItems="center"
                columnGap="5px"
              >
                Enterprise
                <Text
                  color="#4A5568"
                  //   fontFamily="Plus Jakarta Sans"
                  fontStyle="normal"
                  fontWeight="500"
                  fontSize={["10px", "12px", "13px", "14px"]}
                  lineHeight={["15px", "15px", "18px", "21px"]}
                >
                  (unlimited developers)
                </Text>
              </Flex>
              <Text
                color="#120F43"
                //   fontFamily="Plus Jakarta Sans"
                fontStyle="normal"
                fontWeight="800"
                fontSize={["22px", "28px", "36px", "48px"]}
                lineHeight={["28px", "36px", "56px", "72px"]}
              >
                $249
              </Text>
            </Flex>
            <Flex direction="column" rowGap="11px">
              <Text
                color="#120F43"
                //   fontFamily="Plus Jakarta Sans"
                fontStyle="normal"
                fontWeight="700"
                fontSize={["12px", "12px", "14px", "16px"]}
                lineHeight={["16px", "18px", "20px", "24px"]}
              >
                Every feature from Teams Plan but for Unlimited Users.
              </Text>
              <Text
                color="#4A5568"
                //   fontFamily="Plus Jakarta Sans"
                fontStyle="normal"
                fontWeight="500"
                fontSize={["10px", "12px", "13px", "14px"]}
                lineHeight={["15px", "15px", "18px", "21px"]}
                maxWidth="448px"
              >
                Relevant for large-scale uses and extended redistribution
                rights. A license for large companies working on
                enterprise-level AI projects.
              </Text>
            </Flex>

            <Flex
              width={["100%", "100%", "100%", "169px"]}
              height={["40px", "40px", "40px", "54px"]}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap="-0.57px"
              border="1px solid #CBD5E0"
              borderRadius="45px"
            >
              <Text
                color="#120F43"
                textAlign="center"
                fontSize={["10px", "12px", "13px", "14px"]}
                lineHeight={["14px", "14px", "14px", "16.8px"]}
                //   fontFamily="Plus Jakarta Sans"
                fontStyle="normal"
                fontWeight="600"
              >
                Buy it now{" "}
              </Text>
              <Flex w="14px" h="14px">
                <ChevronRightIcon />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

export default RightPlan;
