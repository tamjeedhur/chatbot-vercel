"use client";
import { Button } from "@chakra-ui/react";
import { useState } from "react";

const ScanTypeButtons = (props: any) => {
  const [activeButton, setActiveButton] = useState<any | null>("Sitemap");
  // const { variant, background, children, placeholder, borderRadius, ...rest } =
  //   props;

  const handleButtonClick = (buttonName: string) => {
    if (activeButton !== buttonName) {
      setActiveButton(buttonName);
    } else {
      setActiveButton(null);
    }
  };
  const getButtonColorScheme = (type: string) => {
    return activeButton === type ? "blue" : "gray";
  };

  return (
    <>
      <Button
        colorScheme={getButtonColorScheme("Sitemap")}
        onClick={() => handleButtonClick("Sitemap")}
      >
        Sitemap
      </Button>
      <Button
        colorScheme={getButtonColorScheme("URL")}
        onClick={() => handleButtonClick("URL")}
      >
        URL
      </Button>
    </>
  );
};

export default ScanTypeButtons;
