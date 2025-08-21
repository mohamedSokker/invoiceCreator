"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateTimePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
};

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState("10:30:00");

  // merge date + time
  const handleDateChange = (selectedDate?: Date) => {
    if (!selectedDate) {
      onChange?.(undefined);
      return;
    }

    const [hours, minutes, seconds] = time.split(":").map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes, seconds);
    onChange?.(newDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (value) {
      const [hours, minutes, seconds] = newTime.split(":").map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours, minutes, seconds);
      onChange?.(newDate);
    }
  };

  return (
    <div className="flex gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-32 justify-between font-normal"
          >
            {value ? value.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>

      <Input
        type="time"
        step="1"
        value={time}
        onChange={handleTimeChange}
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
}
