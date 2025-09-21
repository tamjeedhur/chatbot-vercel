'use client';

import { Avatar, Button, Flex, Icon, Link, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, useColorMode, Box } from '@chakra-ui/react';
// Custom Components
// import { ItemContent } from 'components/menu/ItemContent';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { SearchFieldDashboard } from '@/components/searchBar/SearchFieldDashboard';
import PropTypes from 'prop-types';
import React from 'react';
// Assets
import navImage from 'img/layout/Navbar.png';
import { SearchIcon } from '@chakra-ui/icons';

import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';
// routes module not present; keep SidebarResponsive independent of routes here
import { Image } from '../image/Image';

export default function SearchBarDashboard(props: { secondary?: boolean }) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.18)', '14px 17px 40px 4px rgba(112, 144, 176, 0.06)');
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems='center'
      flexDirection='row'
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p='10px'
      borderRadius='30px'
      boxShadow={shadow}>
      <SearchFieldDashboard
        w='100%'
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me='10px'
        borderRadius='30px'
      />
      {/* <Flex
        bg={ethBg}
        display={secondary ? "flex" : "none"}
        borderRadius="30px"
        ms="auto"
        p="6px"
        align="center"
        me="6px"
      >
      
      </Flex> */}
      <Box
        p='0px'
        w='42px'
        height='40px'
        border='1px solid blue'
        borderRadius='20px'
        background='#333399'
        display='flex'
        alignItems='center'
        cursor='pointer'
        justifyContent='center'>
        <SearchIcon
          style={{
            color: 'white',
          }}
        />
      </Box>
    </Flex>
  );
}

// SearchBarDashboard.propTypes = {
//   variant: PropTypes.string,
//   fixed: PropTypes.bool,
//   secondary: PropTypes.bool,
//   onOpen: PropTypes.func,
// };
