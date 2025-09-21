'use client'

import { Box, Flex, Icon, Table, Tbody, Tr, Td, Text } from '@chakra-ui/react'
import React from 'react'
import { ChevronDownIcon } from '@chakra-ui/icons';


function Questions() {

    const faqData = [
      {
        question: "Why do I need a premium AI template?",
       
      }, {
        question: "What are the differences between the licenses from the pricing section?",
       
      }, {
        question: "How do I access updates after purchasing?",
       
      }, {
        question: "How many developers can access the product?",
       
      }, {
        question: "How can I upgrade to a other license?",
       
      }, {
        question: "Can I use Horizon AI Template in an open source project?",
       
      }, {
        question: "How does premium support work?",
       
      }, {
        question: "Is there a Figma version of Horizon AI Template?",
       
      }, {
        question: 'What does "lifetime access" mean?',
       
      }, {
        question: "Are there some tutorials?",
       
      },
    ];

  return (
      <Box maxWidth='1170px' w='100%' mt='140px' display='flex' flexDirection='column' alignItems='center' justifyContent='center' mb='140px'>
      <Text color="#603CFF"
      textAlign="center"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['12px', '12px', '14px', '16px']}
    lineHeight={['16px', '18px', '20px', '24px']}
    letterSpacing={["0px","0px","1px","2px"]}      fontStyle="normal"
      fontWeight="700"
              mb='10px'
          >FREQUENTLY ASKED QUESTIONS</Text>
          <Text color="#120F43"
      textAlign="center"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['20px', '26px', '32px', '38px']}
    lineHeight={['24px', '32px', '40px', '50px']}       fontStyle="normal"
      fontWeight="800"
              mb='21px'
              letterSpacing="-0.5px">Frequently asked questions</Text>
          
          <Text color="#4A5568"
            //   display='flex'
            //   whiteSpace='normal'
      textAlign="center"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
              fontWeight="500"
              maxWidth='606px'
              fontSize={['12px', '14px', '16px', '18px']}
              lineHeight={['16px', '18px', '24px', '30px']}              mb='30px'
              >Looking for something else? Chat with us via hello@simmmple.com or solve your situation faster by joining our Discord community.</Text>
{/*           
<Flex mt='40px' maxWidth="936px"w='100%'height="74px"padding="24px 16px 26px 16px"borderBottom="1px solid #CBD5E0" >
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43"
                      fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}                      fontStyle="normal" fontWeight="700"
                  >
                      Why do I need a premium AI template?
                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
          </Flex>
          <Flex maxWidth="936px"w='100%'height="74px" padding="24px 16px 26px 16px"borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43"
                       fontStyle="normal" fontWeight="700" fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}
                  >
What are the differences between the licenses from the pricing section?                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43"
                      fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}                      fontStyle="normal" fontWeight="700"
                  
                  >
How do I access updates after purchasing?                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43"
                      fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']} fontStyle="normal" fontWeight="700"
                  >
How many developers can access the product?                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43" fontStyle="normal" fontWeight="700" fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}>
How can I upgrade to a other license?                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43" fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']} fontStyle="normal" fontWeight="700" >
Can I use Horizon AI Template in an open source project?                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43" fontStyle="normal" fontWeight="700" fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}>
How does premium support work?                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43"  fontStyle="normal" fontWeight="700" fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}>
Is there a Figma version of Horizon AI Template?                </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43"  fontStyle="normal" fontWeight="700" fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}>
What does "lifetime access" mean?                  </Text>
<Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
      </Flex>
      <Flex maxWidth="936px" w='100%' height="74px" padding="24px 16px 26px 16px" borderBottom="1px solid #CBD5E0">
<Flex w='100%' display='flex' justifyContent="space-between" alignItems="center">
                  <Text
                    //   fontFamily="Plus Jakarta Sans"
                      color="#120F43" fontStyle="normal" fontWeight="700" fontSize={['12px', '12px', '14px', '16px']}
                      lineHeight={['16px', '18px', '20px', '24px']}>
Are there some tutorials?                  </Text>
          <Icon as={ChevronDownIcon} color="#4A5568" boxSize={6} /></Flex>
         
</Flex> */}
<Table maxWidth='1170px' w='100%' mt='70px'>
      <Tbody >
        {faqData.map((item, index) => (
          <Tr key={index} borderBottom="1px solid #CBD5E0">
            <Td display='flex' justifyContent='space-between'>
              <Text color="#120F43" fontSize={['12px', '12px', '14px', '16px']} fontWeight="700" lineHeight={['16px', '18px', '20px', '24px']}
              >
                {item.question}
               
              </Text>
              <Icon as={ChevronDownIcon} boxSize={6} color="#4A5568" />
              </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    </Box>
  )
}

export default Questions
