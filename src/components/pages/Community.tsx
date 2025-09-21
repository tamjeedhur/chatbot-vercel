'use client'

import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

function Community() {
  return (
    <Box maxWidth='1170px' width='100%' >
          <Flex display="flex"
              p='0px 20px'
              w='100%'
              minHeight='200px'
      justifyContent="center"
      alignItems="center"
      gap="66px"
      borderRadius="16px"
      background="linear-gradient(180deg, #603CFF 0%, #3609FF 100%)" >
              <Flex display="flex"
                  w='100%'
                  rowGap='10px'
                  maxW="1170px"
                  flexDirection={{ base: 'column',md:'row' }}
      justifyContent="space-around"
                  alignItems={{ base: 'start',md:'center' }}
                  // textAlign='center'
      >
              <Image w={['53.5px','53.5px','63.5px','73.5px']} h={['42px','42px','49px','56px']} src='discord.png' alt='' />
              <Flex direction='column'>
              <Text  color="#FFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="700"
      fontSize={['18px', '22px', '26px', '30px']}
      lineHeight={['22px', '28px', '36px', '45px']}       letterSpacing="-0.5px">Connect with the community!</Text>
              <Text  color="#FFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
                          fontWeight="500"
                          fontSize={['14px', '16px', '18px', '20px']}
lineHeight={['16px', '18px', '24px', '30px']}
      letterSpacing="-0.5px">Feel free to ask questions, report issues, and meet new people.</Text>
              </Flex>
              <Flex display="flex"
                      color='#603CFF'
                      width={['220px', '220px', '230px', '276px']}
                      height={['40px','40px','40px','54px']}
                      
      justifyContent="center"
                      alignItems="center"
                      fontSize={['10px', '12px', '13px', '14px']}
                      lineHeight={['12px', '13px', '14px', '16px']}

      borderRadius="45px"
                  background="#FFF"
              fontWeight='600'>
                  Join the #HorizonUI Community!
              </Flex>
             </Flex>
      </Flex>
    </Box>
  )
}

export default Community
