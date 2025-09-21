import { extendTheme, HTMLChakraProps, ThemingProps } from '@chakra-ui/react';
import { CardComponent } from './card';
import { buttonStyles } from './button';
import { badgeStyles } from './badge';
import { inputStyles } from './input';
import { progressStyles } from './progress';
import { sliderStyles } from './slider';
import { textareaStyles } from './textarea';
import { switchStyles } from './switch';
import { linkStyles } from './link';
import { globalStyles } from './styles';

export default extendTheme(
	globalStyles,
	badgeStyles, // badge styles
	buttonStyles, // button styles
	linkStyles, // link styles
	progressStyles, // progress styles
	sliderStyles, // slider styles
	inputStyles, // input styles
	textareaStyles, // textarea styles
	switchStyles, // switch styles
	CardComponent // card component
);

export interface CustomCardProps extends HTMLChakraProps<'div'>, ThemingProps {}
