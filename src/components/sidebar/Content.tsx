// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
import Links from "./Links";
import Brand from "./Brand";
import { IRoute } from "@/types/navigation";
import Link from "next/link";


function Content(props: { routes: IRoute[] }) {  
  const { routes } = props;
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <Brand />
      <Stack direction="column" mt="8px" mb="auto">
        <Box ps="20px" pe={{ lg: "16px", "2xl": "16px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box
        ps="20px"
        pe={{ lg: "16px", "2xl": "20px" }}
        mt="60px"
        mb="40px"
        borderRadius="30px"
      ></Box>
    </Flex>
  );
}

export default Content;
