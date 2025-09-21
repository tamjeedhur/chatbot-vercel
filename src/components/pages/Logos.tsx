'use client'

import { Box, Text, Flex, Image, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
// import SignOut from '../SignOut'
function Logos() {
  return (
      <Box display='flex' flexDir='column' rowGap='40px' mt='69px' mb='50px' maxWidth='1170px'>
      {/* <SignOut /> */}
          <Text color="#A0AEC0"
      textAlign="center"
      fontFamily="Plus Jakarta Sans"
      fontSize={['12px', '12px', '14px', '16px']}
      fontStyle="normal"
      fontWeight="700"
      lineHeight="24px"
      letterSpacing="2px">
          JOIN 30,000+ DEVELOPERS & BUSINESSES THAT USE THE ENTIRE HORIZON UI CORE
              </Text>
          <SimpleGrid display='grid' gridTemplateColumns={[ '1fr 1fr 1fr' ,'1fr 1fr 1fr' ,'1fr 1fr 1fr', '1fr 1fr 1fr 1fr 1fr 1fr']}  alignItems='center' justifyContent='space-between' gap='60px' mb='40px'>
          <Image objectFit='contain' src='samsung.png' alt='' />
          <Image src='microsoft.png' alt='' />
          <Image src='calcom.png' alt='' />
          <Image src='cisco.png' alt='' />
          <Image src='envato.png' alt='' />
          <Image src='infosys.png' alt='' />
              </SimpleGrid>
         
    </Box>
  )
}

export default Logos
