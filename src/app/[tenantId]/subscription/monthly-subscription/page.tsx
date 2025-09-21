"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/adminlayout/AdminLayout";
import {
  Box,
  Text,
  Flex,
  Image,
  SimpleGrid,
  Button,
  Badge,
} from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import paymentMachine from "../../../../machines/paymentMachine";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

function MonthlySubscription() {
  const router = useRouter();
  const [state, send] = useMachine(paymentMachine) as unknown as [
    {
      matches: (
        value: "idle" | "createStripeSession" | "paymentSuccess"
      ) => boolean;
      context: { sessionUrl: string };
    },
    (event: {
      type: string;
      priceId?: string;
      productId?: string;
      recurring?: boolean;
    }) => void
  ];
  const [currentPlan, setCurrentPlan] = useState("");

  const gridData = [
    {
      headImage: "/purple.png",
      heading: "Start-Ups",
      headingDesc: "(for one developer)",
      description:
        "A recommended single license for solo designers & developers building high-end AI projects & applications.",
      packagePrice: "$29",
      packageDiscount: false,
      packagePayment: "Monthly payment",
      packageTax: "VAT taxes included",
      upgradeButton: "Upgrade to this plan",
      trialButton: "Subscribe on trial basis",
      priceId: "price_1Q2AEEJP2P7GaukUxIEl5Pms",
      productId: "prod_QtyAT2cwu907ls",
    },
    {
      headImage: "/purple.png",
      heading: "Start-Ups",
      headingDesc: "(for one developer)",
      description:
        "A recommended single license for solo designers & developers building high-end AI projects & applications.",
      packagePrice: "$49",
      packageDiscount: false,
      packagePayment: "Monthly payment",
      packageTax: "VAT taxes included",
      upgradeButton: "Upgrade to this plan",
      trialButton: "Subscribe on trial basis",
      priceId: "price_1Q2AEEJP2P7GaukUfTHQhMaO",
      productId: "prod_QtyAzzq1FoMo2t",
    },
  ];

  const handlePayment = (priceId: string, productId: string) => {
    send({
      type: "START",
      priceId,
      productId,
      recurring: true,
    });
  };

  const handleTrialSubscription = async (
    priceId: string,
    productId: string
  ) => {
    try {
      const response = await axiosInstance.post(
        "/api/subscriptions/create-trial-session",
        { priceId, productId }
      );

      router.push(response.data.url);
    } catch (error) {
      console.error("Error creating trial subscription session:", error);
    }
  };

  useEffect(() => {
    if (state.matches("paymentSuccess")) {
      router.push(state.context.sessionUrl);
    }
  }, [state]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/subscriptions/current-subscription-plan"
        );
        setCurrentPlan(response.data?.priceId);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
      }
    };
    fetchPlans();
  }, []);

  return (
    <AdminLayout>
      <Box
        maxWidth="1170px"
        width="100%"
        display="flex"
        flexDirection="column"
        rowGap="30px"
        style={{ marginTop: "15vh" }}
      >
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Text
            color="#603CFF"
            textAlign="center"
            fontWeight="700"
            fontSize="16px"
            lineHeight="24px"
            mb="10px"
          >
            PRICING PLANS
          </Text>
          <Flex direction="column">
            <Box
              color="#120F43"
              textAlign="center"
              fontSize="58px"
              fontWeight="800"
              position="relative"
            >
              Choose the right plan for
              <Text
                color="#120F43"
                fontWeight="800"
                fontSize="58px"
                lineHeight="70px"
              >
                you and your business
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Box
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <SimpleGrid columns={{ lg: 2 }} spacing={7}>
            {gridData.map((data, index) => (
              <Flex
                key={index}
                w="100%"
                p={{ base: "20px", sm: "24px", md: "32px", lg: "40px" }}
                borderRadius="16px"
                direction="column"
                rowGap="50px"
                background="#2C1166"
                boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
              >
                <Flex columnGap="28px">
                  <Image w="70px" h="70px" src={data.headImage} alt="" />
                  <Flex direction="column" rowGap="6px">
                    <Flex color="#FFF" fontSize="16px" fontWeight="700">
                      {data.heading}
                      <Text color="#FFF" fontSize="14px" fontWeight="500">
                        {data.headingDesc}
                      </Text>
                    </Flex>
                    <Text
                      color="#FFF"
                      fontSize="14px"
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
                    p="40px"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Flex justifyContent="flex-end" w="100%">
                      <Flex columnGap="20px" mb="30px">
                        <Flex
                          fontSize="16px"
                          fontWeight="800"
                          color="#FFF"
                          display="flex"
                          flexDirection="column"
                        >
                          {data.packagePrice}
                          {data.packageDiscount && (
                            <Text
                              color="#01B574"
                              fontSize="14px"
                              fontWeight="500"
                            >
                              -76% discount
                            </Text>
                          )}
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
                          fontSize="14px"
                          fontWeight="700"
                        >
                          {data.packagePayment}
                          <Text
                            color="#CBD5E0"
                            fontSize="14px"
                            fontWeight="500"
                          >
                            {data.packageTax}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    {data.priceId === currentPlan ? (
                      <Badge
                        variant="solid"
                        colorScheme="green"
                        fontSize="lg"
                        mb="18px"
                      >
                        Current Subscription
                      </Badge>
                    ) : (
                      <Flex mb="18px" display="flex" maxH="52px" minH="52px">
                        <Button
                          isLoading={state.matches("createStripeSession")}
                          colorScheme="blue"
                          onClick={() =>
                            handlePayment(data.priceId, data.productId)
                          }
                          mr={3} // Add margin to separate buttons
                        >
                          {data.upgradeButton}
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
        <Box
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <SimpleGrid columns={{ lg: 2 }} spacing={7}>
            {gridData.map((data, index) =>
              data.priceId !== currentPlan ? (
                <Flex
                  key={index}
                  w="100%"
                  p={{ base: "20px", sm: "24px", md: "32px", lg: "40px" }}
                  borderRadius="16px"
                  direction="column"
                  rowGap="50px"
                  background="#2C1166"
                  boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
                >
                  <Flex columnGap="28px">
                    <Image w="70px" h="70px" src={data.headImage} alt="" />
                    <Flex direction="column" rowGap="6px">
                      <Flex color="#FFF" fontSize="16px" fontWeight="700">
                        {data.heading}
                        <Text color="#FFF" fontSize="14px" fontWeight="500">
                          {data.headingDesc}
                        </Text>
                      </Flex>
                      <Text
                        color="#FFF"
                        fontSize="14px"
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
                      p="40px"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Flex justifyContent="flex-end" w="100%">
                        <Flex columnGap="20px" mb="30px">
                          <Flex
                            fontSize="16px"
                            fontWeight="800"
                            color="#FFF"
                            display="flex"
                            flexDirection="column"
                          >
                            {data.packagePrice}
                            {data.packageDiscount && (
                              <Text
                                color="#01B574"
                                fontSize="14px"
                                fontWeight="500"
                              >
                                -76% discount
                              </Text>
                            )}
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
                            fontSize="14px"
                            fontWeight="700"
                          >
                            {data.packagePayment}
                            <Text
                              color="#CBD5E0"
                              fontSize="14px"
                              fontWeight="500"
                            >
                              {data.packageTax}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Flex mb="18px" display="flex" maxH="52px" minH="52px">
                        <Button
                          isLoading={state.matches("createStripeSession")}
                          colorScheme="teal"
                          onClick={() =>
                            handleTrialSubscription(
                              data.priceId,
                              data.productId
                            )
                          }
                        >
                          {data.trialButton}
                        </Button>
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>
              ) : null
            )}
          </SimpleGrid>
        </Box>
      </Box>
    </AdminLayout>
  );
}

export default MonthlySubscription;
