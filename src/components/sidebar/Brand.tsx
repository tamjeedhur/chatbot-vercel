// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from '@/icons/icons';
// import { HSeparator } from 'components/separator/Separator';
import { HSeparator } from '../pages/Separator';
export function Brand() {
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			<HorizonLogo h='160px' w='175px' my='0px' color={logoColor} />
			<HSeparator mb='20px' mt='20px' />
		</Flex>
	);
}

export default Brand;
 