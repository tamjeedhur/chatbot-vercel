'use client'

import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

function Footer() {
  return (
    <Box maxWidth='1170px' w='100%' display='flex' alignItems='center'  mt='99px' justifyContent='center' flexDirection='column'>
      <Flex w='100%' display='flex' justifyContent='space-between' flexDirection={{ base: 'column', lg: 'row' }} alignItems='start' gap='20px'
        // columnGap='80px'
      >
              <Flex w={['120px', '150px', '180px', '370px']}  display={['flex']} flexDirection={{ base: 'row', lg: 'column' }} alignItems='start' justifyContent='flex-start'>
             
                  <Flex w='100%' display='flex' direction='row' alignItems='center' columnGap='10px' mb='20px' justifyContent='flex-start'>
           <Image w='179px' h='39px' objectFit='contain' src='horizonlogo.png' alt='' />
                      <Text display="flex"
                          alignItems='center'
                          justifyContent='center'
                          color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
                          fontStyle="normal"
                          fontSize={['10px', '11px', '12px', '12px']}
lineHeight={['12px', '14px', '16px', '18px']}
      fontWeight="700"
                          borderRadius="25px"
              minW='84px'
              maxW='84px'
                          // w='100%'
minH='27px'
                          background="#E9E3FF">AI Template</Text></Flex>
                  
          <Text display={{ base: 'none', lg: 'block' }} w={['270px', '300px', '330px', '356px']} color="#4A5568"
            // w='100%'
    //   fontFamily="Plus Jakarta Sans"
    lineHeight={['14px', '16px', '20px', '25px']}

    fontSize={['10px', '12px', '13px', '14px']}      fontStyle="normal"
      fontWeight="500"
                     
                      mb='26px'
                  >
                  Start building your AI SaaS Prompts apps with Horizon
AI Template, the trendiest ChatGPT Admin Template
for React, NextJS and Chakra UI!
                  </Text>
                  
                  <Flex  display={{ base: 'none', lg: 'flex' }} border='1px solid #FF6154' borderRadius='10px' columnGap='10px' maxW='249px' w='100%' minH='53px' alignItems='center' justifyContent='center'>
                      <Image w={['14.9px','16.9px','18.9px','20.9px']} h={['19px','22px','25px','28px']}    src='thirdRank.png' alt='' />
                      <Flex direction='column' rowGap='3px'>
                          <Text color="#FF6154"
fontSize={['8px', '8px', '9px', '9px']}
fontStyle="normal"
      fontWeight="700"
      lineHeight="normal">PRODUCT HUNT</Text>
                          <Text color="#FF6154"
    //   fontFamily="Helvetica"
    fontSize={['12px', '12px', '14px', '16px']}
    fontStyle="normal"
      fontWeight="700"
      lineHeight="normal">#3 Product of the Day</Text>
                      </Flex>
                  </Flex>
               
              </Flex>
              <Flex maxW={['100%', '100%', '100%', '700px']} w='100%'  display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
                  <Flex direction='column' rowGap='20px'>
                      <Text color="#1B2559"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="600"
      fontSize={['12px', '12px', '14px', '16px']}
lineHeight={['15px', '15px', '18px', '21px']}>
        Resources</Text>
                      <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
                          fontWeight="500"
                          fontSize={['10px', '12px', '13px', '14px']}
                          lineHeight={['15px', '15px', '18px', '21px']}
                      >Horizon UI Free</Text>
                      <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
      >Horizon UI PRO</Text>
                      <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
     >Components</Text>
                      <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="500"
      fontSize={['10px', '12px', '13px', '14px']}
      lineHeight={['15px', '15px', '18px', '21px']}>Blog</Text>
                  </Flex>
                  <Flex direction='column' rowGap='20px'>
                  <Text color="#1B2559"
    //   fontFamily="Plus Jakarta Sans"
    lineHeight={['15px', '15px', '18px', '21px']}
    fontSize={['12px', '12px', '14px', '16px']}      fontStyle="normal"
      fontWeight="600"
   >Help & Support</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
      
      fontStyle="normal"
      fontWeight="500"
      fontSize={['10px', '12px', '13px', '14px']}
                          lineHeight={['15px', '15px', '18px', '21px']}>Documentation</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
     > Contact Us</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
     >Support</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
      >Roadmap</Text>
                      
                  </Flex>
                  <Flex direction='column' rowGap='20px'>
                  <Text color="#1B2559"
    //   fontFamily="Plus Jakarta Sans"
    lineHeight={['15px', '15px', '18px', '21px']}
    fontSize={['12px', '12px', '14px', '16px']}      fontStyle="normal"
      fontWeight="600"
   >Social Media</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
                          lineHeight={['15px', '15px', '18px', '21px']}
      fontStyle="normal"
      fontWeight="500"
      >Github</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}
      fontStyle="normal"
      fontWeight="500"
     >Twitter</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
      > Instagram</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
     >Facebook</Text>
                      
                  </Flex>
                  <Flex direction='column' rowGap='20px'>
                  <Text color="#1B2559"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="600"
      lineHeight={['15px', '15px', '18px', '21px']}
      fontSize={['12px', '12px', '14px', '16px']}>Legal Resources</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
   >Terms & Conditions</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
       fontStyle="normal"
      fontWeight="500"
      fontSize={['10px', '12px', '13px', '14px']}
      lineHeight={['15px', '15px', '18px', '21px']}>Privacy Policy</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
  >License</Text>
                  <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['10px', '12px', '13px', '14px']}
    lineHeight={['15px', '15px', '18px', '21px']}      fontStyle="normal"
      fontWeight="500"
  >Refund Policy</Text>
                      
                  </Flex>
              </Flex>
          </Flex>
          <Box
      
      width='100%'
      height="1px"
              background="#E2E8F0"
              mt='75px'
              mb='50px'
    />
<Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"

      fontStyle="normal"
              fontWeight="500"
              mb='30px'
              fontSize={['10px', '12px', '13px', '14px']}
              lineHeight={['15px', '15px', '18px', '21px']}
          >Horizon UI © 2021-2023 Copyright. All rights reserved.</Text>
    </Box>
  )
}

export default Footer
