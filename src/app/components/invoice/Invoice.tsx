import React, { useRef, useState } from "react"; 
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import PrinterIcon from "@/icons/PrinterIcon"; 
import html2pdf from "html2pdf.js";

const Invoice = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue("#ffffff", "navy.700");
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  
  // Dummy data state
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "9831",
    dateIssued: "14 Nov 1997",
    dueDate: "16 Nov 2024",
    officeAddress: {
      line1: "Office 145, 450 WAPDA Town Lahore",
      city: "Lahore",
      country: "Pakistan",
      phone: "+92 300 1234568",
    },
    billingTo: {
      name: "Tamjeed Hur",
      address: "Wapda Town Street No. 01, Lahore, Pakistan",
      phone: "+92 300 0000000",
      email: "email@testmail.com",
    },
    billTo: {
      totalDue: "$12,458",
      bankName: "American Bank",
      country: "Pakistan",
      iban: "PK96HABB142479005274",
      swiftCode: "BR11090",
    },
    features: [
      "PayPal payments",
      "Logic jumps",
      "File upload with 5GB storage",
      "Custom domain support",
      "Stripe integration",
    ],
    invoiceItems: [
      {
        package: "Basic Plan",
        features: [
          "PayPal payments",
          "Logic jumps",
          "File upload with 5GB storage",
          "Custom domain support",
          "Stripe integration",
        ],
        price: "$50",
        discount: "10%",
        total: "$45",
      },
    ],
  });

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const handleDownload = () => {
    if (invoiceRef.current) {
      const element = invoiceRef.current.cloneNode(true) as HTMLElement;
  
      // Remove icons with 'no-print' class
      const noPrintElements = element.querySelectorAll('.no-print');
      noPrintElements.forEach(el => el.remove());
  
      // Override styles for the PDF
      element.style.setProperty('color', '#1A202C', 'important'); // Dark text color
      element.style.setProperty('background-color', '#FFFFFF', 'important'); // Light background
  
      // Add CSS reset styles
      const style = document.createElement('style');
      style.innerHTML = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0; // Prevent body margin issues
        }
        .invoice-print {
          padding: 20; // Remove padding for PDF
        }
          table {
        width: 100%;
        border-collapse: collapse;
      }

    
      `;
      element.prepend(style);
  
      // Ensure child elements also inherit these styles
      const childElements = element.querySelectorAll('*');
      childElements.forEach((child) => {
        (child as HTMLElement).style.setProperty('color', '#1A202C', 'important');
        (child as HTMLElement).style.setProperty('background-color', '#FFFFFF', 'important');
      });
  
      html2pdf()
        .from(element)
        .save(`${invoiceData.invoiceNumber}.pdf`)
        .then(() => {});
    }
  };
  

  const dynamicIconColor = textColorPrimary == "secondaryGray.900" ? "#1B2559" : "#ffff"
  return (
    <Box
      className="invoice-print"
      width="100%"
      bg={bgColor}
      pt="100px"
      px={8}
      pb={16}
      borderRadius="20px"
      ref={invoiceRef} 
      maxWidth="1400px"
      mx="auto"
    >
      <Flex wrap="wrap" justifyContent="space-between" alignItems="center">
        <Heading color={textColorPrimary}>Invoice</Heading>
        <Flex gap="30px" className="no-print">
          <IconButton
            aria-label="Download Invoice"
            icon={<DownloadIcon color={textColorPrimary} width={6} height={6} />}
            onClick={handleDownload} 
            variant="ghost"
            cursor="pointer"
          />
          <IconButton
            aria-label="Print Invoice"
            icon={<PrinterIcon strokeColor={dynamicIconColor} />}
            onClick={handlePrint}
            variant="ghost"
            cursor="pointer"
          />
        </Flex>
      </Flex>
      <Text as="h1" fontSize="22px" color={textColorPrimary} mt={10}>
        Invoice# {invoiceData.invoiceNumber}
      </Text>

      {/* Office Address */}
      <Flex justifyContent="space-between" wrap="wrap" gap="20px" mt={6}>
        <Flex direction="column" gap={1}>
          <Text as="p" color={textColorPrimary} fontSize="16px">
            {invoiceData.officeAddress.line1}
          </Text>
          <Text as="p" color={textColorSecondary} fontSize="16px">
            {invoiceData.officeAddress.city}, {invoiceData.officeAddress.country}
          </Text>
          <Text as="p" color={textColorSecondary} fontSize="16px">
            {invoiceData.officeAddress.phone}
          </Text>
        </Flex>
        <Flex direction="column" gap={1}>
          <Text as="p" color={textColorSecondary} fontSize="16px">
            Date issued: {invoiceData.dateIssued}
          </Text>
          <Text as="p" color={textColorSecondary} fontSize="16px">
            Due Date: {invoiceData.dueDate}
          </Text>
        </Flex>
      </Flex>

      {/* Billing section */}
      <Flex mt={16} justifyContent="space-between" wrap="wrap" gap="20px">
        <Flex direction="column" gap={1}>
          <Text as="p" color={textColorPrimary} fontSize="18px" fontWeight={600}>
            Invoice To:
          </Text>
          <Text as="p" fontSize="16px" color={textColorPrimary} mt={3} fontWeight="bold">
            {invoiceData.billingTo.name}
          </Text>
          <Text as="p" fontSize="16px" color={textColorSecondary}>
            {invoiceData.billingTo.address}
          </Text>
          <Text as="p" fontSize="16px" color={textColorSecondary}>
            {invoiceData.billingTo.phone}
          </Text>
          <Text as="p" fontSize="16px" color={textColorSecondary}>
            {invoiceData.billingTo.email}
          </Text>
        </Flex>

        <Flex direction="column" gap={1}>
          <Text as="p" color={textColorPrimary} fontSize="18px" fontWeight={600}>
            Bill To:
          </Text>
          <Text as="p" fontSize="16px" color={textColorPrimary} mt={3} fontWeight="bold">
            Total Due: {invoiceData.billTo.totalDue}
          </Text>
          <Text as="p" fontSize="16px" color={textColorSecondary}>
            Bank Name: {invoiceData.billTo.bankName}
          </Text>
          <Text as="p" fontSize="16px" color={textColorSecondary}>
            Country: {invoiceData.billTo.country}
          </Text>
          <Text as="p" fontSize="16px" color={textColorSecondary}>
            IBAN: {invoiceData.billTo.iban}
          </Text>
          <Text as="p" fontSize="16px" color={textColorSecondary}>
            SWIFT Code: {invoiceData.billTo.swiftCode}
          </Text>
        </Flex>
      </Flex>

      {/* Invoice Table */}
      <TableContainer mt={12}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color={textColorPrimary}>Package</Th>
              <Th color={textColorPrimary}>Description</Th>
              <Th color={textColorPrimary}>Price</Th>
              <Th color={textColorPrimary}>Discount</Th>
              <Th color={textColorPrimary}>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoiceData.invoiceItems.map((item, index) => (
              <Tr key={index}>
                <Td color={textColorSecondary}>{item.package}</Td>
                <Td color={textColorSecondary}>
                  <Flex direction="column">
                    {item.features.map((feature, featureIndex) => (
                      <Text as="p" key={featureIndex} className="feat">
                        {feature}
                      </Text>
                    ))}
                  </Flex>
                </Td>
                <Td color={textColorSecondary}>{item.price}</Td>
                <Td color={textColorSecondary}>{item.discount}</Td>
                <Td color={textColorPrimary}>{item.total}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Box mt={4} textAlign="right">
        <Text as="p" color={textColorPrimary} mr="0px" fontSize="24px" fontWeight="bold">
          Total : {invoiceData.invoiceItems.reduce((total, item) => total + parseFloat(item.total.slice(1)), 0).toFixed(2)}
        </Text>
      </Box>
    </Box>
  );
};

export default Invoice;
