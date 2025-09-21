import React, { useState } from "react";
import {
  Box,
  useColorModeValue,
  Text,
  Flex,
  FormLabel,
  Input,
  SimpleGrid,
  Button,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import StyledPhoneInput from "./CustomPhoneInput";
import { BillingAddressState } from "@/types/interfaces";



const initialState: BillingAddressState = {
  companyName: "",
  billingEmail: "",
  taxId: "",
  vatNumber: "",
  phoneNum: "",
  country: "",
  billingAddress: "",
  state: "",
  zipCode: "",
};

const BillingAddress: React.FC = () => {
  const [billingAddress, setBillingAddress] =
    useState<BillingAddressState>(initialState);
  const [errors, setErrors] = useState<Partial<BillingAddressState>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof BillingAddressState, boolean>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handlePhoneChange = (phone: string | undefined) => {
    setBillingAddress((prev) => ({
      ...prev,
      phoneNum: phone || "",
    }));
    validateField("phoneNum", phone || "");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, billingAddress[name as keyof BillingAddressState]);
  };

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "This field is required" }));
    } else {
      switch (name) {
        case "billingEmail":
          if (!isValidEmail(value)) {
            setErrors((prev) => ({ ...prev, [name]: "Invalid email address" }));
          } else {
            removeError(name);
          }
          break;
        case "phoneNum":
          if (!isValidPhoneNumber(value)) {
            setErrors((prev) => ({ ...prev, [name]: "Invalid phone number" }));
          } else {
            removeError(name);
          }
          break;
        case "zipCode":
          if (!isValidZipCode(value)) {
            setErrors((prev) => ({ ...prev, [name]: "Invalid zip code" }));
          } else {
            removeError(name);
          }
          break;
        case "taxId":
          if (!isValidTaxId(value)) {
            setErrors((prev) => ({ ...prev, [name]: "Invalid Tax ID format" }));
          } else {
            removeError(name);
          }
          break;
        default:
          removeError(name);
      }
    }
  };

  const removeError = (name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof BillingAddressState];
      return newErrors;
    });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string) => {
    return phone.trim().length > 0 && /^\+?[1-9]\d{1,14}$/.test(phone); // E.164 format
  };

  const isValidZipCode = (zipCode: string) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  const isValidTaxId = (taxId: string) => {
    const taxIdRegex = /^\d{2}-\d{7}$/;
    return taxIdRegex.test(taxId);
  };

  const sanitizeInput = (
    value: string,
    fieldName: keyof BillingAddressState
  ): string => {
    switch (fieldName) {
      case "taxId":
        return value; 
      case "phoneNum":
      case "zipCode":
      case "companyName":
      case "billingEmail":
      case "vatNumber":
      case "country":
      case "state":
      case "billingAddress":
        return value.replace(/[^a-zA-Z0-9\s\-\.,]/g, ""); 
      default:
        return value;
    }
  };

  const validateForm = () => {
    const newErrors: Partial<BillingAddressState> = {};
    let isValid = true;

    Object.entries(billingAddress).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof BillingAddressState] = "This field is required";
        isValid = false;
      } else {
        validateField(key, value);
        if (errors[key as keyof BillingAddressState]) {
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const bgColor = useColorModeValue("#ffffff", "navy.700");
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const handleSubmit = () => {
    if (validateForm()) {
      const sanitizedData: BillingAddressState = {
        companyName: sanitizeInput(
          billingAddress.companyName.trim(),
          "companyName"
        ),
        billingEmail: sanitizeInput(
          billingAddress.billingEmail.trim(),
          "billingEmail"
        ),
        taxId: sanitizeInput(billingAddress.taxId.trim(), "taxId"),
        vatNumber: sanitizeInput(billingAddress.vatNumber.trim(), "vatNumber"),
        phoneNum: sanitizeInput(billingAddress.phoneNum.trim(), "phoneNum"),
        country: sanitizeInput(billingAddress.country.trim(), "country"),
        billingAddress: sanitizeInput(
          billingAddress.billingAddress.trim(),
          "billingAddress"
        ),
        state: sanitizeInput(billingAddress.state.trim(), "state"),
        zipCode: sanitizeInput(billingAddress.zipCode.trim(), "zipCode"),
      };
      console.log("Form submitted:", sanitizedData);
      setBillingAddress(initialState);
      setErrors({});
      setTouched({});
    }
  };

  const handleDiscard = () => {
    setBillingAddress(initialState);
    setErrors({});
    setTouched({});
  };

  const shouldShowError = (fieldName: keyof BillingAddressState): boolean => {
    return !!touched[fieldName] && !!errors[fieldName];
  };
  return (
    <Box
      width="100%"
      bg={bgColor}
      pt="100px"
      px={8}
      pb={16}
      borderRadius="20px"
    >
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb={6}
      >
        Billing Address
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {[
          { label: "Company Name", name: "companyName" },
          { label: "Billing Email", name: "billingEmail" },
          { label: "Tax ID (XX-XXXXXXX)", name: "taxId" },
          { label: "VAT Number", name: "vatNumber" },
          { label: "Country", name: "country" },
          { label: "State", name: "state" },
          { label: "Zip Code", name: "zipCode" },
        ].map(({ label, name }) => (
          <FormControl
            key={name}
            isInvalid={shouldShowError(name as keyof BillingAddressState)}
            maxWidth="600px"
          >
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Input
              id={name}
              name={name}
              placeholder={`Enter your ${label.toLowerCase()}`}
              value={billingAddress[name as keyof BillingAddressState]}
              onChange={handleChange}
              onBlur={handleBlur}
              
            />
            <FormErrorMessage>
              {errors[name as keyof BillingAddressState]}
            </FormErrorMessage>
          </FormControl>
        ))}

<FormControl isInvalid={shouldShowError("phoneNum")} maxWidth="600px">
  <FormLabel htmlFor="phoneNum">Phone Number</FormLabel>
  <StyledPhoneInput
    id="phoneNum" 
    name="phoneNum" 
    value={billingAddress.phoneNum}
    onChange={handlePhoneChange} 
    onBlur={() => setTouched((prev) => ({ ...prev, phoneNum: true }))}
    defaultCountry="us" // Change to lowercase
    style={{ width: "100%" }}
  />
  <FormErrorMessage>{errors.phoneNum}</FormErrorMessage>
</FormControl>

      </SimpleGrid>

      <Flex gap={4} mt={4} wrap="wrap">
        <Button variant="brand" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button variant="outline" onClick={handleDiscard}>
          Discard
        </Button>
      </Flex>
    </Box>
  );
};

export default BillingAddress;
