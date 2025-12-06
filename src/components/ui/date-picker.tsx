"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Pick a date",
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className={`w-full justify-between font-normal ${!date ? "text-muted-foreground hover:text-muted-foreground" : "text-foreground hover:text-foreground"}`}
        >
          {date ? date.toLocaleDateString() : placeholder}
          <ChevronDownIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="center">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
