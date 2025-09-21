import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Flex,
  Select,
  Text,
  useColorModeValue,
  CircularProgress,
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import DateRangePicker from "./DatePicker";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Usage = () => {
  const bgColor = useColorModeValue("#ffffff", "navy.700");
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  const lineColor = useColorModeValue("gray.200", "gray.700");

  const [creditUsed, setCreditUsed] = useState(32084);
  const [chatbotUsed, setChatbotUsed] = useState(7);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<any>(null); // Data for chart

  let totalCredit = 40020;
  let totalChatbot = 11;

  // Generate Dummy Data for the Last 30 Days
  const generateLast30DaysData = () => {
    const today = new Date();
    let dummyData = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      dummyData.push({
        date: formattedDate,
        credits: Math.floor(Math.random() * 5000) + 1000, // Random credits between 1000 and 6000
      });
    }

    return dummyData;
  };

  // Default Date Range (Last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setStartDate(thirtyDaysAgo);
    setEndDate(today);

    // Generate data for the last 30 days
    const filteredData = generateLast30DaysData();
    console.log("Default 30 Days Data:", filteredData);

    // Update chart data with the generated data
    setChartData({
      labels: filteredData.map((entry) => entry.date),
      datasets: [
        {
          label: "Credits Used",
          data: filteredData.map((entry) => entry.credits),
          backgroundColor: textColorPrimary,
          borderRadius: 4,
        },
      ],
    });
  }, []);

  // Handle Date Range Change (from DatePicker)
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    console.log("Selected Start Date:", formatDate(start));
    console.log("Selected End Date:", formatDate(end));

    // Get filtered data based on the selected date range
    const filteredData = getDummyData(start, end);
    console.log("Filtered Data:", filteredData);

    // If data exists, update chartData, otherwise set empty data for the chart
    setChartData({
      labels: filteredData.length > 0 ? filteredData.map((entry) => entry.date) : ['No Data'],
      datasets: [
        {
          label: "Credits Used",
          data: filteredData.length > 0 ? filteredData.map((entry) => entry.credits) : [0],
          backgroundColor: textColorPrimary,
          borderRadius: 4,
        },
      ],
    });
  };

  const getDummyData = (start: Date | null, end: Date | null) => {
    const dummyData = generateLast30DaysData(); // Use the 30-day dummy data generator

    if (!start || !end) return dummyData;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return dummyData.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <Box
      bg={bgColor}
      color={textColorPrimary}
      width="100%"
      mt={12}
      pt="100px"
      px={8}
      pb={16}
      borderRadius="20px"
    >
      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="space-between"
        align="center"
        gap={5}
      >
        <Text
          alignSelf="flex-start"
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="2xl"
        >
          Usage
        </Text>
        <Flex gap={2} flexDirection={{ base: "column", md: "row" }}>
          <Select
            defaultValue="all"
            color={textColorPrimary}
            borderRadius="lg"
            borderColor={lineColor}
            variant="main"
            width="240px"
          >
            <option value="all">All Chatbots</option>
            <option value="active">Active Chatbots</option>
          </Select>
          <DateRangePicker onDateRangeChange={handleDateRangeChange} />
        </Flex>
      </Flex>

      <Flex gap={4} wrap="wrap" mt={4} flexDirection={{ base: "column", sm: "row" }}>
        <Card p="15px" borderRadius="20px" flex="1" position="relative">
          <CircularProgress
            value={(creditUsed / totalCredit) * 100}
            size="45px"
            thickness="8px"
            color={textColorPrimary}
            trackColor={textColorSecondary}
            position="absolute"
            top="15px"
            left="15px"
          ></CircularProgress>
          <Text as="p" fontSize="2xl" fontWeight="bold" mt="45px">
            {creditUsed}
            <Text as="span" color={textColorSecondary} fontSize="lg">
              /{totalCredit}
            </Text>
          </Text>
          <Text as="p" fontSize="medium" color={textColorSecondary}>
            credit used
          </Text>
        </Card>

        <Card p="15px" borderRadius="20px" flex="1" position="relative">
          <CircularProgress
            value={(chatbotUsed / totalChatbot) * 100}
            size="45px"
            thickness="8px"
            color={textColorPrimary}
            trackColor={textColorSecondary}
            position="absolute"
            top="15px"
            left="15px"
          ></CircularProgress>
          <Text as="p" fontSize="2xl" fontWeight="bold" mt="45px">
            {chatbotUsed}
            <Text as="span" color={textColorSecondary} fontSize="lg">
              /{totalChatbot}
            </Text>
          </Text>
          <Text as="p" fontSize="medium" color={textColorSecondary}>
            chatbots used
          </Text>
        </Card>
      </Flex>

      {chartData ? (
        <Box
          mt={10}
          width="100%"
          height={{ base: "230px", sm: "300", md: "400px", lg: "500px" }}
          flex="1"
        >
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </Box>
      ) : (
        <Box mt={10} width="100%" textAlign="center">
          <Text fontSize="xl" color={textColorPrimary}>
            Please Select a Valid Date for Data Graph
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Usage;
