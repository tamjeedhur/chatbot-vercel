import React, { useState } from 'react';
import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Flex,
  Text
} from '@chakra-ui/react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './datePicker.css'

type DateRangePickerProps = {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date || null);
    if (date && endDate) {
      onDateRangeChange(date, endDate);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date || null);
    if (startDate && date) {
      onDateRangeChange(startDate, date);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} placement="bottom-end">
      <PopoverTrigger>
        <Button onClick={() => setIsOpen(true)}>
          {startDate && endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : 'Select Date Range'}
        </Button>
      </PopoverTrigger>
      <PopoverContent width="100%" p={4}>
        <PopoverBody>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            <Box>
              <Text fontWeight="bold">Start Date</Text>
              <DayPicker
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => handleStartDateChange(date as Date | undefined)}
                footer={null}
              />
            </Box>
            <Box>
              <Text fontWeight="bold">End Date</Text>
              <DayPicker
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => handleEndDateChange(date as Date | undefined)}
                footer={null}
              />
            </Box>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
