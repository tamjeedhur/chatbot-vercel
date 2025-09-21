"use client";

import AdminLayout from "@/components/adminlayout/AdminLayout";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import axiosInstance from "@/lib/axiosInstance";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";

function DashboardAnalytics() {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [newCustomersThisMonth, setNewCustomersThisMonth] = useState<
    number | null
  >(null);
  const [totalTransactions, setTotalTransactions] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTotalRevenue(),
        fetchTotalStripeCustomers(),
        fetchTotalStripeTransactions(),
        fetchPaymentHistory(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [toast]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/analytics/payment-history"
      );
      setPaymentHistory(response.data.paymentHistory);
    } catch (error) {
      toast({
        title: "Error fetching payment history",
        description: "Unable to load payment history",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await axiosInstance.get("/api/analytics/total-revenue");
      setTotalRevenue(parseFloat(response.data.totalRevenue));
      setRevenueData(normalizeRevenueData(response.data.monthlyRevenue));
    } catch (error) {
      toast({
        title: "Error fetching revenue data",
        description: "Unable to load total revenue data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchTotalStripeCustomers = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/analytics/total-stripe-customers"
      );
      setTotalCustomers(response.data.totalCustomers);
      setNewCustomersThisMonth(response.data.newCustomersThisMonth);
    } catch (error) {
      toast({
        title: "Error fetching customer data",
        description: "Unable to load customer data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchTotalStripeTransactions = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/analytics/total-stripe-transactions"
      );
      setTotalTransactions(response.data.totalTransactions);
    } catch (error) {
      toast({
        title: "Error fetching transaction data",
        description: "Unable to load transaction data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (value: number) => {
    if (typeof value !== "number" || isNaN(value)) {
      return "$0.00";
    }
    return `$${value.toFixed(2)}`;
  };

  const normalizeRevenueData = (data: any[]) => {
    return data.map((item) => ({
      ...item,
      revenue: parseFloat(item.revenue),
    }));
  };

  return (
    <AdminLayout>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt="12vh">
        <Box
          p="6"
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          height="150px"
          width="auto"
        >
          <Heading size="md" mb={4}>
            Total Revenue (Annual)
          </Heading>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {formatCurrency(totalRevenue ?? 0)}
            </Text>
          )}
        </Box>

        <Box
          p="6"
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          height="150px"
          width="auto"
        >
          <Heading size="md" mb={4}>
            Total Stripe Customers (Annual)
          </Heading>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                Total Customers: {totalCustomers ?? 0}
              </Text>
              <Text fontSize="lg" color="gray.500">
                New Customers This Month: {newCustomersThisMonth ?? 0}
              </Text>
            </>
          )}
        </Box>

        <Box
          p="6"
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          height="150px"
          width="auto"
        >
          <Heading size="md" mb={4}>
            Total Stripe Transactions (This Year)
          </Heading>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              Total Transactions: {totalTransactions ?? 0}
            </Text>
          )}
        </Box>
      </SimpleGrid>
      <Box p="6" bg="white" boxShadow="md" borderRadius="20px" mb={6} mt="3vh">
        <Heading size="lg" mb={4}>
          Revenue Over Time
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip
              formatter={(value: any) => [formatCurrency(value), "Revenue"]}
            />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="revenue"
              fill="#82ca9d"
              stroke="#82ca9d"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      <Box
        p="6"
        bg="white"
        boxShadow="md"
        borderRadius="20px"
        mb={6}
        width="auto"
      >
        <Heading size="lg" mb={4}>
          Payment History
        </Heading>
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Card</Th>
                  <Th>Date</Th>
                  <Th>Currency</Th>
                  <Th isNumeric>Spendings</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paymentHistory.map((payment, index) => (
                  <Tr key={index}>
                    <Td>
                      <Image
                        src={payment.cardLogo}
                        alt="Card Logo"
                        boxSize="50px"
                      />
                    </Td>
                    <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                    <Td textTransform="uppercase">{payment.currency}</Td>
                    <Td isNumeric>{formatCurrency(payment.amount)}</Td>
                    <Td>{payment.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AdminLayout>
  );
}

export default DashboardAnalytics;
