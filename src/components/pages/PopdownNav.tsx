'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

function PopdownNav() {
  return (
    <Box
            
            // display={['flex', 'flex', 'flex', 'none']}
      maxWidth='1170px' width='100%'
      display='flex'
                zIndex="9999" alignItems='center'
            justifyContent='space-around'
      >
    
      <Flex maxWidth='530px' w='100%' alignItems='center'
            justifyContent='flex-start' columnGap='20px' display={['flex','flex','flex','none']} pos='absolute' top='15%' left='10%'>
       
       
         
        
            <Text
              //   fontFamily="Plus Jakarta Sans"
              p='7px 15px'
              fontSize="18px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="24px"
              color='#FFFFFF'
              textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
              _hover={{
                boxShadow: "0px 0.602187px 0.602187px -1.25px rgba(0, 0, 0, 0.18), 0px 2.28853px 2.28853px -2.5px rgba(0, 0, 0, 0.16), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.063)",
                bgGradient: "linear(to bottom, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.2) 100%)",
                padding: '7px 15px',
                borderRadius: "12px",
                transition: "background-color 0.3s, box-shadow 0.3s"
              }}>Gallery</Text>
            
            <Text
              //   fontFamily="Plus Jakarta Sans"
              p='7px 15px'
              fontSize="18px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="24px"
              color='#FFFFFF'
              textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
              _hover={{
                boxShadow: "0px 0.602187px 0.602187px -1.25px rgba(0, 0, 0, 0.18), 0px 2.28853px 2.28853px -2.5px rgba(0, 0, 0, 0.16), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.063)",
                bgGradient: "linear(to bottom, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.2) 100%)",
                padding: '7px 15px',
                borderRadius: "12px",
                transition: "background-color 0.3s, box-shadow 0.3s"
              }}>Solutions +</Text>
            <Text
              //   fontFamily="Plus Jakarta Sans"
              p='7px 15px'
              fontSize="18px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="24px"
              color='#FFFFFF'
              textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
              _hover={{
                boxShadow: "0px 0.602187px 0.602187px -1.25px rgba(0, 0, 0, 0.18), 0px 2.28853px 2.28853px -2.5px rgba(0, 0, 0, 0.16), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.063)",
                bgGradient: "linear(to bottom, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.2) 100%)",
                padding: '7px 15px',
                borderRadius: "12px",
                transition: "background-color 0.3s, box-shadow 0.3s"
              }}>Pricing</Text>
      
     
        </Flex>
      </Box>
  )
}

export default PopdownNav
