/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";

export interface SelectOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  selectedValues?: string[];
  onSelectionChange?: (selectedValues: string[]) => void;
  placeholder?: string;
  multiSelect?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  disabled?: boolean;
  maxSelections?: number;
}

export default function SelectDropdown({
  options,
  selectedValues = [],
  onSelectionChange,
  placeholder = "Select options",
  multiSelect = true,
  triggerClassName = "",
  contentClassName = "",
  align = "end",
  disabled = false,
  maxSelections,
}: SelectDropdownProps) {
  const [internalSelected, setInternalSelected] =
    useState<string[]>(selectedValues);

  // Sync with external selectedValues prop
  useEffect(() => {
    setInternalSelected(selectedValues);
  }, [selectedValues]);

  const handleOptionToggle = (optionId: string) => {
    let newSelected: string[];

    if (multiSelect) {
      if (internalSelected.includes(optionId)) {
        // Remove from selection
        newSelected = internalSelected.filter((id) => id !== optionId);
      } else {
        // Add to selection (check max limit)
        if (maxSelections && internalSelected.length >= maxSelections) {
          return; // Don't add if max reached
        }
        newSelected = [...internalSelected, optionId];
      }
    } else {
      // Single select mode
      newSelected = internalSelected.includes(optionId) ? [] : [optionId];
    }

    setInternalSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const getSelectedLabels = () => {
    const selectedOptions = options.filter((option) =>
      internalSelected.includes(option.id)
    );
    return selectedOptions.map((option) => option.label).join(", ");
  };

  const displayText =
    internalSelected.length > 0 ? getSelectedLabels() : placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          disabled={disabled}
          className={`ml-auto !px-1.5 h-8 flex bg-muted text-primary hover:text-secondary transition-all ease-in-out duration-200 border border-border ${triggerClassName}`}
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={`mt-1 ${contentClassName}`}>
        {options.map((option) => {
          const isSelected = internalSelected.includes(option.id);
          const isDisabled =
            option.disabled ||
            disabled ||
            (maxSelections &&
              !isSelected &&
              internalSelected.length >= maxSelections);

          return (
            <DropdownMenuCheckboxItem
              key={option.id}
              className="cursor-pointer"
              checked={isSelected}
              disabled={isDisabled as boolean}
              onCheckedChange={() => handleOptionToggle(option.id)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
