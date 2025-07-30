/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { FieldValues } from "react-hook-form";

interface UseFormAutosaveProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  key: string;
  exclude?: (keyof T)[];
  debounceMs?: number;
}

export function useFormAutosave<T extends Record<string, any>>({
  form,
  key,
  exclude = [],
  debounceMs = 500,
}: UseFormAutosaveProps<T>) {
  const { watch, reset } = form;
  const formValues = watch();
  const excludeSet = useMemo(() => new Set(exclude), [exclude]);
  const initialLoadRef = useRef(true);

  // Load saved form data on initial mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(key);

      if (savedData) {
        const parsedData = JSON.parse(savedData, (key, value) => {
          // Convert ISO date strings back to Date objects
          if (
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
          ) {
            return new Date(value);
          }
          return value;
        });

        // Merge saved data with default values
        reset({ ...form.getValues(), ...parsedData });
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
    }

    initialLoadRef.current = false;
  }, [key, reset, form]);

  // Save form data on changes
  useEffect(() => {
    if (initialLoadRef.current) return;

    const saveToLocalStorage = debounce(() => {
      try {
        // Filter out excluded fields
        const dataToSave = Object.entries(formValues).reduce(
          (acc, [fieldKey, value]) => {
            if (!excludeSet.has(fieldKey as keyof T)) {
              acc[fieldKey] = value;
            }
            return acc;
          },
          {} as Record<string, unknown>
        );

        localStorage.setItem(key, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error saving form data to localStorage:", error);
      }
    }, debounceMs);

    saveToLocalStorage();

    return () => {
      saveToLocalStorage.cancel();
    };
  }, [formValues, key, excludeSet, debounceMs]);

  // Function to clear saved form data
  const clearSavedData = () => {
    localStorage.removeItem(key);
  };

  return { clearSavedData };
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
