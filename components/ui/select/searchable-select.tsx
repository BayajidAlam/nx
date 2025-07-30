/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface SearchableSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  triggerContent?: React.ReactNode;
}

export function SearchableSelect({
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled = false,
  className,
  children,
  triggerContent,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between px-4 py-3 text-base border border-input rounded-lg bg-background focus:outline-none focus:border-transparent focus:shadow transition-all duration-200",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {triggerContent || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>{children}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface SearchableSelectItemProps {
  value: string;
  onSelect: (value: string) => void;
  children: React.ReactNode;
  selectedValue?: string;
  searchableText?: string;
  className?: string;
}

export function SearchableSelectItem({
  value,
  onSelect,
  children,
  selectedValue,
  searchableText,
  className,
}: SearchableSelectItemProps) {
  const filterValue =
    searchableText ||
    (typeof children === "string"
      ? children
      : typeof value === "string"
        ? value
        : "");
  return (
    <CommandItem
      value={filterValue}
      onSelect={() => {
        onSelect(value);
      }}
      className={cn("flex items-center justify-between", className)}
    >
      <div className="flex items-center space-x-2">
        {children}
        {searchableText && <span className="sr-only">{searchableText}</span>}
      </div>

      <Check
        className={cn(
          "ml-auto h-4 w-4",
          selectedValue === value ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
}
