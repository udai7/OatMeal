"use client";

import { useFormContext } from "@/lib/context/FormProvider";
import React, { useState, useEffect } from "react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Loader2 } from "lucide-react";
import { updateResume } from "@/lib/actions/resume.actions";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PersonalDetailValidationSchema } from "@/lib/validations/resume";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { personalDetailFields } from "@/lib/fields";

const PersonalDetailsForm = ({ params }: { params: { id: string } }) => {
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof PersonalDetailValidationSchema>>({
    resolver: zodResolver(PersonalDetailValidationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      address: "",
      phone: "",
      email: "",
      portfolio: "",
      linkedin: "",
    },
  });

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      form.reset({
        firstName: formData?.firstName || "",
        lastName: formData?.lastName || "",
        jobTitle: formData?.jobTitle || "",
        address: formData?.address || "",
        phone: formData?.phone || "",
        email: formData?.email || "",
        portfolio: formData?.portfolio || "",
        linkedin: formData?.linkedin || "",
      });
    }
  }, [formData, form]);

  const onSave = async (
    data: z.infer<typeof PersonalDetailValidationSchema>
  ) => {
    setIsLoading(true);
    const updates = { ...data };
    const result = await updateResume({ resumeId: params.id, updates });

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Personal details updated successfully.",
        className: "bg-white",
      });
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-neutral-900 border border-neutral-800">
      <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
        Personal Details
      </h2>
      <p className="mt-1 text-sm text-neutral-400">
        Get started with the basic information
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)}>
          <div className="grid grid-cols-2 mt-5 gap-3">
            {personalDetailFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem className={field.fullWidth ? "col-span-2" : ""}>
                    <FormLabel className="text-neutral-300 font-semibold text-md">
                      {field.label}:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        className={`no-focus border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 ${
                          form.formState.errors[field.name]
                            ? "border-red-500"
                            : ""
                        }`}
                        autoComplete="off"
                        {...formField}
                        onChange={(e) => {
                          formField.onChange(e);
                          handleInputChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="mt-5 flex justify-end gap-5">
            <Button
              type="submit"
              className="bg-primary-700 hover:bg-primary-800 text-white"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalDetailsForm;
