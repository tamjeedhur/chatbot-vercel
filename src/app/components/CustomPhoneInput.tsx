import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useColorModeValue } from "@chakra-ui/react";
import { StyledPhoneInputProps } from "@/types/interfaces";



const StyledPhoneInput: React.FC<StyledPhoneInputProps> = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  defaultCountry = "us",
  style,
}) => {
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  const inputBg = useColorModeValue("transparent", "navy.800");
  const inputColor = useColorModeValue("secondaryGray.900", "white");

  const dynamicBorderColor = borderColor === "secondaryGray.100" ? "#E0E5F2" : "rgba(0, 0, 0, 0.04)";
  const dynamicBg = inputBg === "transparent" ? 'transparent' : "#111c44";
  const dynamicInputColor = inputColor === "white" ? "#fff" : "#1B2559";

  return (
    <div className="styled-phone-input-container">
      <PhoneInput
        country={defaultCountry}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        inputProps={{
          name: name,
          id: id,
          style: {
            width: "100%",
            border: `1px solid ${dynamicBorderColor}`,
            borderRadius: "16px",
            background: dynamicBg,
            color: dynamicInputColor,
            padding: "20px 15px 20px 50px",
            fontSize: "14px",
          },
        }}
        containerStyle={{
          width: "100%",
        }}
        buttonStyle={{
          border: "none",
          background: "transparent",
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        dropdownStyle={{
          width: "250px",
          background:dynamicBg,
          color: dynamicInputColor,
        }}
      />
      <style jsx global>{`
        .styled-phone-input-container {
          position: relative;
          width: 100%;
        }
        .styled-phone-input-container .react-tel-input .form-control {
          border-radius: 16px !important;
        }
        .styled-phone-input-container .react-tel-input .flag-dropdown {
          border: none;
          background-color: transparent;
          border-radius: 16px 0 0 16px;
        }
        .styled-phone-input-container .react-tel-input .selected-flag {
          background-color: transparent !important;
          border-radius: 16px 0 0 16px;
        }
        .styled-phone-input-container .react-tel-input .selected-flag:hover,
        .styled-phone-input-container .react-tel-input .selected-flag:focus {
          background-color: transparent !important;
        }
        .styled-phone-input-container .react-tel-input .flag-dropdown.open,
        .styled-phone-input-container .react-tel-input .flag-dropdown.open .selected-flag {
          border-radius: 16px 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default StyledPhoneInput;