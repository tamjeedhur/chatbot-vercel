'use client'


import { Box, Flex, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { useMediaQuery } from '@chakra-ui/react';


function Customizable() {
    const [isMobileView] = useMediaQuery('(min-width: 900px)');

  return (
      <Box maxWidth='1230px' display='flex' rowGap='90px' flexDirection='column' mb='120px'>
          <Flex display='flex'     flexDirection={{ base: 'column',lg:'row' }}
          alignItems='center'
              justifyContent='center'
              columnGap='30px'
          
          >
              <Box w='100%'    maxWidth='676px'>
          <Flex mb='10px'>
              <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
                          fontWeight="700"
                          fontSize={['11px', '12px', '13px', '14px']}
lineHeight={['14px', '16px', '18px', '21px']}
letterSpacing={["0px","0px","1px","2px"]}
                      >FULLY CUSTOMIZABLE AI TEMPLATE</Text>
          </Flex>
          <Flex mb='20px'>
              <Text color="#120F43"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['16px', '20px', '24px', '32px']}
    lineHeight={['20px', '28px', '38px', '48px']}       fontStyle="normal"
      fontWeight="800"
    
                  letterSpacing="-0.5px"
              maxWidth='563px'>
              The perfect starting kit to create your
AI projects that you always wanted
              </Text>
          </Flex>
          <Flex mb='29px'>
              <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="500"
      fontSize={['12px', '14px', '16px', '18px']}
                          lineHeight={['16px', '18px', '24px', '30px']}
                          maxWidth='562px'>
              Customize and create your AI apps & projects the way you like and
need. Define and give your project a better look by choosing your
favorite theme mode from Dark & Light!
              </Text>
          </Flex>
          <Flex direction='column' rowGap='24px'>
          <Flex columnGap='73.5px' >
              <Flex  columnGap='10px'>
                  <Image w='26px' h='26px'    objectFit='contain' src='arrow.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="600"
      fontSize={['12px', '12px', '14px', '16px']}
      lineHeight={['16px', '18px', '20px', '24px']}                                     maxWidth='248px'>
                  Lifetime free updates & growing
components library
                  </Text>
              </Flex>
              <Flex  columnGap='15px'>
                  <Image w='10.83px' h='19.5px'    objectFit='contain' src='flash.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
                                  fontWeight="600"
                                  fontSize={['12px', '12px', '14px', '16px']}
                                  lineHeight={['16px', '18px', '20px', '24px']}   
      maxWidth='163px'>
Lightning-fast user journey & experience
                  </Text>
              </Flex>
          </Flex>
          <Flex columnGap='33px'>
              <Flex  columnGap='10px'>
                  <Image w='26px' h='26px'    objectFit='contain' src='layer.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['12px', '12px', '14px', '16px']}
      lineHeight={['16px', '18px', '20px', '24px']}         fontStyle="normal"
      fontWeight="600"
                                  maxWidth='281px'>
                 Templates, prompts, users, settings,
and many more
                  </Text>
              </Flex>
              <Flex  columnGap='9px'>
                  <Image w='26px' h='26px'    objectFit='contain' src='dollar.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['12px', '12px', '14px', '16px']}
      lineHeight={['16px', '18px', '20px', '24px']}         fontStyle="normal"
      fontWeight="600"
                                  maxWidth='151px'>
                  Best investment for your AI Projects
                  </Text>
              </Flex>
          </Flex>
         </Flex>
              </Box>
              <Box>
              <Image objectFit='contain'  src='rightCustomizable.png' alt='' />
</Box>
          </Flex>

          <Flex columnGap='30px' flexDirection={{ base: 'column-reverse',lg:'row' }}
          alignItems='center'
              justifyContent='center'>
          <Box paddingTop='60px'>
              <Image objectFit='contain'  src='leftCustomizable.png' alt='' />
</Box>
              <Box maxWidth='676px' w='100%'>
          <Flex mb='10px'>
              <Text color="#603CFF" 
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['11px', '12px', '13px', '14px']}
    lineHeight={['14px', '16px', '18px', '21px']}
    letterSpacing={["0px","0px","1px","2px"]}
      fontStyle="normal"
      fontWeight="700"
  >
WORKFLOW LIKE NEVER BEFORE                      </Text>
          </Flex>
          <Flex mb='20px'>
              <Text color="#120F43"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['16px', '20px', '24px', '32px']}
    lineHeight={['20px', '28px', '38px', '48px']}       fontStyle="normal"
      fontWeight="800"
                  letterSpacing="-0.5px"
              maxWidth='439px'>
              Improve your development process tremendously faster
              </Text>
          </Flex>
          <Flex mb='29px'>
              <Text color="#4A5568"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['12px', '14px', '16px', '18px']}
    lineHeight={['16px', '18px', '24px', '30px']}      fontStyle="normal"
      fontWeight="500"
               
                  maxWidth='587px'>
              Horizon AI Template gives you access to a pack with over 100+
frontend individual elements, like buttons, inputs, prompt templates,
cards, or alerts, giving you the freedom of choosing and combining.
              </Text>
          </Flex>
          <Flex direction='column' rowGap='24px'>
          <Flex columnGap='80px' >
              <Flex  columnGap='10px'>
                  <Image w='26px' h='26px'    objectFit='contain' src='layer.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="600"
      fontSize={['12px', '12px', '14px', '16px']}
      lineHeight={['16px', '18px', '20px', '24px']}                                  maxWidth='154px'>
                  Clean & structured coded components
                  </Text>
              </Flex>
              <Flex  columnGap='15px'>
                  <Image w='26px' h='26px'    objectFit='contain' src='joints.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
    fontSize={['12px', '12px', '14px', '16px']}
      lineHeight={['16px', '18px', '20px', '24px']}         fontStyle="normal"
      fontWeight="600"
                              
                                  maxWidth='198px'>
Available in the most used technology & framework
                  </Text>
              </Flex>
          </Flex>
          <Flex columnGap='50px'>
              <Flex  columnGap='10px'>
                  <Image w='26px' h='26px'    objectFit='contain' src='desktop.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
                                  fontWeight="600"
                                  fontSize={['12px', '12px', '14px', '16px']}
                                  lineHeight={['16px', '18px', '20px', '24px']}   
       maxWidth='183px'>
                 Full responsive desktop and mobile examples
                  </Text>
              </Flex>
              <Flex  columnGap='15px'>
                  <Image w='26px' h='26px'    objectFit='contain' src='tick.png' alt='' />
                  <Text color="#603CFF"
    //   fontFamily="Plus Jakarta Sans"
      fontStyle="normal"
      fontWeight="600"
      fontSize={['12px', '12px', '14px', '16px']}
      lineHeight={['16px', '18px', '20px', '24px']}                                     maxWidth='213px'>
                  Production-ready ChatGPT template prompts
                  </Text>
              </Flex>
          </Flex>
         </Flex>
              </Box>
        
          </Flex>
    </Box>
  )
}

export default Customizable
