/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  ResetAlert,
  SearchableSelect,
  SearchableSelectItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import { zodResolver } from "@hookform/resolvers/zod";
import { countries, CountryInterface } from "country-codes-flags-phone-codes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  teacherFormSchema,
  TeacherFormValues,
} from "../_schemas/committee-schema";

import FieldLabel from "@/components/ui/form/field-label";
import { useFormAutosave } from "@/hooks/use-form-autosave";
import { schoolCommitteeDesignations } from "@/mocks/designations";
import { Loader2, RotateCcw } from "lucide-react";

export default function CreateTeacherForm() {
  const [selectedCountry, setSelectedCountry] =
    useState<CountryInterface | null>(null);

  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      designation: "",
      photoUrl: "",
      phone: {
        countryCode: "+880",
        number: "",
      },
    },
  });

  const { clearSavedData } = useFormAutosave({
    form,
    key: "committee-create-form-draft",
    debounceMs: 1000,
  });

  const handleCountryCodeChange = (dialCode: string) => {
    const country = countries.find((c) => c.dialCode === dialCode);
    if (!country) return;

    setSelectedCountry(country);

    form.setValue("phone.countryCode", country.dialCode);
  };

  async function onSubmit(data: TeacherFormValues) {
    console.log(data);
  }

  function handleCancel() {
    form.reset();
  }
  // Function to handle form reset
  const handleReset = () => {
    // Clear saved data from storage
    clearSavedData();
    window.location.reload();
  };

  useEffect(() => {
    const code = form.getValues("phone.countryCode");
    if (!selectedCountry && code) {
      const country = countries.find((c) => c.dialCode === code);
      if (country) setSelectedCountry(country);
    }
  }, [form, selectedCountry]);

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl font-semibold flex justify-between">
          <div>Committee Details </div>

          <ResetAlert
            onConfirm={() => {
              handleReset();
            }}
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9 transition-all hover:bg-muted hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </ResetAlert>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel>
                    Name <span className="text-destructive">*</span>
                  </FieldLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      disabled={submitting}
                      {...field}
                      className="mt-1.5"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel>
                    Email <span className="text-destructive">*</span>
                  </FieldLabel>

                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@doe.com"
                      disabled={submitting}
                      {...field}
                      className="mt-1.5"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone */}
            <div className="space-y-2 sm:space-y-3">
              <FieldLabel>
                Phone <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="flex gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="phone.countryCode"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormControl>
                        <SearchableSelect
                          value={field.value}
                          onValueChange={handleCountryCodeChange}
                          placeholder="Code"
                          searchPlaceholder="Search country codes..."
                          emptyText="No country codes found."
                          disabled={true}
                          triggerContent={
                            selectedCountry ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {selectedCountry.flag}
                                </span>
                                <span className="text-sm font-medium">
                                  {selectedCountry.dialCode}
                                </span>
                              </div>
                            ) : (
                              "Code"
                            )
                          }
                        >
                          {countries.map((country) => (
                            <SearchableSelectItem
                              key={country.code}
                              value={country.dialCode}
                              onSelect={handleCountryCodeChange}
                              selectedValue={field.value}
                              searchableText={`${country.name} ${country.dialCode}`}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{country.flag}</span>
                                <span className="font-medium">
                                  {country.dialCode}
                                </span>
                                <span className="text-sm text-muted-foreground truncate">
                                  {country.name}
                                </span>
                              </div>
                            </SearchableSelectItem>
                          ))}
                        </SearchableSelect>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number Input */}
                <FormField
                  control={form.control}
                  name="phone.number"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="123456879"
                          className=" px-4  "
                          disabled={submitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage className="text-sm " />
            </div>

            {/* Designation */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem className="space-y-2 sm:space-y-3">
                  <FieldLabel>
                    Designation <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FormControl>
                    <div className="relative mt-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={submitting}
                      >
                        <SelectTrigger className="w-full px-4 py-3  text-sm font-medium  border border-input rounded-lg bg-background focus:outline-none focus:border-transparent focus:shadow transition-all duration-200">
                          <SelectValue placeholder="Select Designation" />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolCommitteeDesignations.map(
                            (designation, index) => (
                              <SelectItem
                                key={index}
                                value={designation.value}
                                className="capitalize"
                              >
                                {designation.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm " />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || "Something went wrong"}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription className="text-green-600">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="w-full flex justify-center gap-4 col-span-2">
              <Button
                className="w-full flex-1"
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
