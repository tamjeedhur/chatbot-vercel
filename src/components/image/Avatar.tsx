import { chakra, useColorMode } from "@chakra-ui/react";
import { ComponentProps } from "react";
import { Image } from "./Image";

type AvatarImageProps = ComponentProps<typeof Image> & {
  src?: any;
  alt?: any;
  style?: React.CSSProperties;
  showBorder?: boolean;
};

export function NextAvatar({
  src,
  alt,
  style,
  showBorder,
  ...props
}: AvatarImageProps) {
  const { colorMode } = useColorMode();

  return (
    <Image
      {...props}
      {...(showBorder
        ? {
            border: "2px",
            borderColor: colorMode === "dark" ? "navy.700" : "white",
          }
        : {})}
      alt={alt}
      src={src}
      style={{ ...style, borderRadius: "50%" }}
    />
  );
}

export const ChakraNextAvatar = chakra(NextAvatar, {
  shouldForwardProp: (prop) => ["width", "height", "src", "alt"].includes(prop),
});
