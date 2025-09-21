import React from "react";
import {
  Container,
  InputGroup,
  InputRightElement,
  Icon,
  IconButton,
  Box,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { SearchIcon } from "@chakra-ui/icons";
import { Input } from "@/components/ui/input"
import { SearchBarScProps } from "@/types/interfaces";




const SearchBarSc = ({
  handleOnSearch,
  handleClickOnSearch,
  loading = true,
  searchText,
  activeButton
}: SearchBarScProps) => {
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  return (
    <Flex
      w="100%"
      columnGap="10px"
      //   w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      //   flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Input
        type="text"
        disabled={loading}
        placeholder={activeButton == "URL"?"https://example.com": "https://example.com/sitemap"}
        className="rounded-3xl text-sm bg-gray-50 hover:bg-gray-50 focus:bg-gray-200"
      
       
        name="search"
        onChange={handleOnSearch}
      />
      <IconButton
        borderRadius="full"
        cursor="pointer"
        onClick={() => handleClickOnSearch(searchText)}
        _hover={{ backgroundColor: "teal.400" }}
        isLoading={loading}
        aria-label={""}
      >
        <Box
          p="0px"
          w="40px"
          maxW="40px"
          height="40px"
          maxH="40px"
          border="1px solid blue"
          borderRadius="20px"
          background="#333399"
          display="flex"
          alignItems="center"
          cursor="pointer"
          justifyContent="center"
        >
          <SearchIcon
            onClick={() => handleClickOnSearch(searchText)}
            style={{
              color: "white",
            }}
          />
        </Box>
      </IconButton>
    </Flex>
  );
};

export default SearchBarSc;
