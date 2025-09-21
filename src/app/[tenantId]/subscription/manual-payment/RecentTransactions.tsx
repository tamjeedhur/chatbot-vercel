import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
} from "@chakra-ui/react";

const RecentTransactions: React.FC<{ transactions: any[] }> = ({
  transactions,
}) => {
  return (
    <Box
      p={8}
      maxW="auto"
      mx="auto"
      borderWidth={1}
      boxShadow="md"
      mt="10vh"
      backgroundColor="white"
      borderRadius="20px"
    >
      <Heading size="lg" mb={6}>
        Recent Transactions
      </Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Transaction ID</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Captured</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{transaction.id}</Td>
              <Td>${transaction.amount.toFixed(2) / 100}</Td>
              <Td>{new Date(transaction.created * 1000).toLocaleString()}</Td>
              <Td>{transaction.status}</Td>
              <Td>{transaction.captured.toString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RecentTransactions;
