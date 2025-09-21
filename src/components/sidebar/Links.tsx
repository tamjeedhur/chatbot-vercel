import React from 'react';
import { Box, Flex, HStack, Text, useColorModeValue, VStack, Icon, Button, IconButton } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { IRoute } from '@/types/navigation';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';

interface SidebarLinksProps {
  routes: IRoute[];
}

interface SubMenuItem {
  name: string;
  path: string;
}

export function Links(props: SidebarLinksProps) {
  const { routes } = props;
  const pathname = usePathname() || '';
  const router = useRouter();
  const [subscriptionDropDown, setSubscriptionDropDown] = useState(false);
  const [dataSourceDropDown, setDataSourceDropDown] = useState(false);
  const [state, send] = useChatBotMachineState();
  const textColor = useColorModeValue('navy.700', 'white');
  const activeColor = useColorModeValue('gray.700', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  const activeRoute = (path: string): boolean => {
    return pathname.toLowerCase().includes(path.toLowerCase());
  };

  useEffect(() => {
    // Open dropdown if current path is subscription or any of its subpages
    if (pathname.includes('/subscription')) {
      setSubscriptionDropDown(true);
    }
    if (pathname.includes('/data-sources')) {
      setDataSourceDropDown(true);
    }
  }, [pathname]);

  const subscriptionSubMenu: SubMenuItem[] = [{ name: 'Billing', path: `/${state.context.selectedChatbot?._id || ''}/subscription/billing` }];

  const dataSourceSubMenu: SubMenuItem[] = [
    { name: 'File', path: `/${state.context.selectedChatbot?._id || ''}/data-sources/file` },
    { name: 'URL/Sitemap', path: `/${state.context.selectedChatbot?._id || ''}/data-sources/urlSitemap` },
    { name: 'Text', path: `/${state.context.selectedChatbot?._id || ''}/data-sources/text` },
    { name: 'Q/A', path: `/${state.context.selectedChatbot?._id || ''}/data-sources/qa` },
  ];

  const renderIcon = (icon?: React.ReactElement) => {
    if (!icon) return null;
    const IconComponent = icon.type;
    return <IconComponent size='20px' style={{ marginRight: '18px' }} />;
  };

  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, index: number) => {
      if (route.name === 'Subscription') {
        return (
          <Box key={index}>
            <HStack py='5px' ps='10px' cursor='pointer'>
              <Flex w='100%' alignItems='center' justifyContent='space-between'>
                <HStack onClick={() => route.path && router.push(route.path)}>
                  {renderIcon(route.icon)}
                  <Text
                    color={activeRoute(route.path ?? '') ? activeColor : textColor}
                    fontWeight={activeRoute(route.path ?? '') ? 'bold' : 'normal'}>
                    {route.name}
                  </Text>
                </HStack>
                <Icon
                  as={subscriptionDropDown ? ChevronUpIcon : ChevronDownIcon}
                  w='20px'
                  h='20px'
                  color={textColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubscriptionDropDown(!subscriptionDropDown);
                  }}
                />
              </Flex>
              <Box h='36px' w='4px' bg={activeRoute(route.path ?? '') ? brandColor : 'transparent'} borderRadius='5px' />
            </HStack>
            {subscriptionDropDown && (
              <VStack align='stretch' ml={12} mt={1}>
                {subscriptionSubMenu.map((subItem, subIndex) => (
                  <Link key={subIndex} href={subItem.path}>
                    <Text color={activeRoute(subItem.path) ? activeColor : textColor} fontWeight={activeRoute(subItem.path) ? 'bold' : 'normal'}>
                      {subItem.name}
                    </Text>
                  </Link>
                ))}
              </VStack>
            )}
          </Box>
        );
      }
      if (route.name === 'Data Sources') {
        return (
          <Box key={index}>
            <HStack py='5px' ps='10px' cursor='pointer'>
              <Flex w='100%' alignItems='center' justifyContent='space-between'>
                <HStack onClick={() => route.path && router.push(route.path)}>
                  {renderIcon(route.icon)}
                  <Text
                    color={activeRoute(route.path ?? '') ? activeColor : textColor}
                    fontWeight={activeRoute(route.path ?? '') ? 'bold' : 'normal'}>
                    {route.name}
                  </Text>
                </HStack>
                <Icon
                  as={dataSourceDropDown ? ChevronUpIcon : ChevronDownIcon}
                  w='20px'
                  h='20px'
                  color={textColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDataSourceDropDown(!dataSourceDropDown);
                  }}
                />
              </Flex>
              <Box h='36px' w='4px' bg={activeRoute(route.path ?? '') ? brandColor : 'transparent'} borderRadius='5px' />
            </HStack>
            {dataSourceDropDown && (
              <VStack align='stretch' ml={12} mt={1}>
                {dataSourceSubMenu.map((subItem, subIndex) => (
                  <Link key={subIndex} href={subItem.path}>
                    <Text color={activeRoute(subItem.path) ? activeColor : textColor} fontWeight={activeRoute(subItem.path) ? 'bold' : 'normal'}>
                      {subItem.name}
                    </Text>
                  </Link>
                ))}
              </VStack>
            )}
          </Box>
        );
      } else {
        return (
          <Link key={index} href={route.path ?? '#'}>
            <Box>
              <HStack py='5px' ps='10px' cursor='pointer'>
                <Flex w='100%' alignItems='center' justifyContent='space-between'>
                  {renderIcon(route.icon)}
                  <Text
                    ml={2}
                    me='auto'
                    color={activeRoute(route.path ?? '') ? activeColor : textColor}
                    fontWeight={activeRoute(route.path ?? '') ? 'bold' : 'normal'}>
                    {route.name}
                  </Text>
                </Flex>
                <Box h='36px' w='4px' bg={activeRoute(route.path ?? '') ? brandColor : 'transparent'} borderRadius='5px' />
              </HStack>
            </Box>
          </Link>
        );
      }
    });
  };

  return <>{createLinks(routes)}</>;
}

export default Links;
