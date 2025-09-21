'use client'

import { Box, Button, Flex, Text, useMediaQuery, Image } from '@chakra-ui/react'
import React,{useState} from 'react'
import PopdownNav from './PopdownNav'
// import { keyframes } from '@emotion/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SignOut from '../SignOut';
import Link from 'next/link';




function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const [isSmallScreen] = useMediaQuery("(max-width: 992px)"); 

  // const expandedHeight = isMenuOpen ? '500px' : '80px'; 
  // const alignItemsValue = isMenuOpen ? 'start' : 'center';
  const expandedHeight = isSmallScreen ? (isMenuOpen ? '500px' : '80px') : '80px';
  const alignItemsValue = isSmallScreen ? (isMenuOpen ? 'start' : 'center') : 'center';




  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }
  


  return (
      <Box height={expandedHeight} maxWidth='1170px' width='100%' display='flex' 
      p='20px 20px'      position="fixed" top='5%'
          backdropFilter="blur(20px)"
         
          borderRadius='20px'
      backgroundColor="rgba(200, 200, 200, 0.4)" 
          zIndex="9999"   alignItems={alignItemsValue} 
      justifyContent='space-around'>
 
     
          
      <Flex
        // maxWidth='530px'
        w='100%' alignItems='center'
            justifyContent='flex-start' columnGap='20px' display={['none','none','none','flex']}>
       
       
         
        
            <Text
              //   fontFamily="Plus Jakarta Sans"
              p='7px 15px'
              fontSize={['14px', '14px', '16px', '18px']}
              lineHeight={['16px', '18px', '20px', '24px']}              fontStyle="normal"
              fontWeight="600"
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
              fontSize={['14px', '14px', '16px', '18px']}
              lineHeight={['16px', '18px', '20px', '24px']}               fontStyle="normal"
              fontWeight="600"
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
              fontSize={['14px', '14px', '16px', '18px']}
              lineHeight={['16px', '18px', '20px', '24px']}               fontStyle="normal"
              fontWeight="600"
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
      <Flex 
        alignItems={'center'}
     
     fontSize={['24px', '28px', '32px', '38px']}
        lineHeight={['24px']}
        fontStyle="normal"
            fontWeight="800"
            textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
            color='#FFF'
      ><Image w={'80px'} h={'80px'} marginTop={'10px'} src='/favicon.png' alt='' />BotSnap
      </Flex>
      <Flex columnGap='15px'
        //  maxWidth='530px'
        w='100%' alignItems='center' justifyContent='flex-end'>
      
        <Text
          display={['none','none','none','flex']}
              //   fontFamily="Plus Jakarta Sans"
              p='7px 15px'
              fontSize={['14px', '14px', '16px', '18px']}
              lineHeight={['16px', '18px', '20px', '24px']}               fontStyle="normal"
              fontWeight="600"
              color='#FFFFFF'
              cursor="pointer"

              textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
              _hover={{
                boxShadow: "0px .602187px .602187px -1.25px rgba(0, 0, 0, 0.18), 0px 2.28853px 2.28853px -2.5px rgba(0, 0, 0, 0.16), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.063)",
                bgGradient: "linear(to bottom, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.2) 100%)",
                padding: '7px 15px',
                borderRadius: "12px",
                transition: "background-color 0.5s, box-shadow 0.5s"
              }}
      
        >
          <Link href={'/sign-in'} > Log In</Link>
         
        </Text>
            <Button
                  
              //   fontFamily="Plus Jakarta Sans"
              p='7px 15px'
              fontSize={['14px', '14px', '16px', '18px']}
              lineHeight={['16px', '18px', '20px', '24px']}               fontStyle="normal"
              fontWeight="600"
              cursor="pointer"

              color='#FFF'
              borderRadius='12px'
              background='linear-gradient(rgb(125, 102, 245) 0%, rgb(74, 41, 194) 100%)'
              textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
              _hover={{
                transform: 'scale(1.05)',
              }}
                 
        >          <Link href={'/sign-up'} > Sign Up</Link>
        </Button>

        
     
          <Flex
            // onClick={toggleMenu}
            alignItems='center'
            justifyContent='center'
        fontWeight="bold"
          color="#FFFFFF"
          fontSize='24px'
        p="3px 7px"
          display={['flex', 'flex', 'flex', 'none']}
          textShadow="1px 1px 3px rgba(0, 0, 0, 0.10)"
          _hover={{
            // padding: '7px 15px',

          boxShadow: "0px .602187px .602187px -1.25px rgba(0, 0, 0, 0.18), 0px 2.28853px 2.28853px -2.5px rgba(0, 0, 0, 0.16), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.063)",
          bgGradient: "linear(to bottom, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.2) 100%)",
          borderRadius:'12px',
          transition: "background-color 0.5s, box-shadow 0.5s"        }}
      >
        ☰
          </Flex>
          {isMenuOpen &&
          // <Flex pos='absolute' top='10%' >
            <PopdownNav />
          // </Flex> 
         
          }
        
        </Flex>
        
            
      
        
          </Box>
  )
}

export default NavBar

// 'use client'

// import React, { useState } from 'react';
// import {
//   Box,
//   Flex,
//   IconButton,
//   useDisclosure,
//   useMediaQuery,
// } from '@chakra-ui/react';
// import { HamburgerIcon } from '@chakra-ui/icons';

// const NavBar = () => {
//   const { isOpen, onToggle } = useDisclosure();
//   const [isLg] = useMediaQuery('(min-width: 992px)');

//   const navbarContent = (
//     <Flex
//       w='100%'
//       h='500px'
//       direction={{ base: 'column', lg: 'row' }}
//       align={{ base: 'stretch', lg: 'center' }}
//       bg="gray.800"
//       py={{ base: 2, lg: 0 }}
//       px={{ base: 4, lg: 8 }}
//       color="white"
//     >
//       {/* Add your navigation links here */}
//       <Box height='120px' color='white'>Link 1</Box>
//       <Box>Link 2</Box>
//       <Box>Link 3</Box>
//     </Flex>
//   );

//   return (
//     <Box w='100%' bg="gray.700" py={2}>
//       <Flex
//         align="center"
//         justify="space-between"
//         px={{ base: 4, lg: 8 }}
//         maxW="1200px"
//         mx="auto"
//       >
//         {isLg ? (
//           // Large Screen Navbar
//           navbarContent
//         ) : (
//           // Mobile Navbar
//           <>
//             <IconButton
//               icon={<HamburgerIcon />}
//               variant="ghost"
//               onClick={onToggle}
//               aria-label="Open Menu"
//             />
//           <Box
//   display={isOpen ? 'block' : 'none'}
//   mt={2}
//   maxHeight={isOpen ? '500px' : 0}
//   overflow="hidden"
//   transition="max-height 0.3s ease-in-out"
//   width="100%"  
// >
//   {navbarContent}
// </Box>
//           </>
//         )}
//       </Flex>
//     </Box>
//   );
// };

// export default NavBar;
