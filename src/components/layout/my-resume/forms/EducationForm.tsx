"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { generateEducationDescription } from "@/lib/actions/gemini.actions";
import { addEducationToResume } from "@/lib/actions/resume.actions";
import { useFormContext } from "@/lib/context/FormProvider";
import { useAITrials } from "@/lib/context/AITrialsContext";
import { educationFields } from "@/lib/fields";
import { EducationValidationSchema } from "@/lib/validations/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Loader2, Minus, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";

const EducationForm = ({ params }: { params: { id: string } }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { formData, handleInputChange } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedDescriptionList, setAiGeneratedDescriptionList] = useState<
    any[]
  >([]);
  const [currentAiIndex, setCurrentAiIndex] = useState(0);
  const { toast } = useToast();
  const { user } = useUser();
  const { useTrialIfAvailable, isTrialExhausted } = useAITrials();

  const form = useForm<z.infer<typeof EducationValidationSchema>>({
    resolver: zodResolver(EducationValidationSchema),
    mode: "onChange",
    defaultValues: {
      education:
        formData?.education?.length > 0
          ? formData.education
          : [
              {
                universityName: "",
                degree: "",
                major: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const handleChange = (
    index: number,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    const newEntries = form.getValues("education").slice();
    newEntries[index] = { ...newEntries[index], [name]: value };
    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const AddNewEducation = () => {
    const newEntry = {
      universityName: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    append(newEntry);
    const newEntries = [...form.getValues("education"), newEntry];
    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const RemoveEducation = (index: number) => {
    remove(index);
    const newEntries = form.getValues("education");
    if (currentAiIndex >= newEntries.length) {
      setCurrentAiIndex(newEntries.length - 1 >= 0 ? newEntries.length - 1 : 0);
    }
    handleInputChange({
      target: {
        name: "education",
        value: newEntries,
      },
    });
  };

  const generateEducationDescriptionFromAI = async (index: number) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use AI features.",
        variant: "destructive",
        className: "bg-white border-2",
      });
      return;
    }

    const education = form.getValues("education")[index];
    if (!education.universityName || !education.degree || !education.major) {
      toast({
        title: "Uh Oh! Something went wrong.",
        description:
          "Please enter the name of institute, degree and major to generate description.",
        variant: "destructive",
        className: "bg-white border-2",
      });
      return;
    }

    // Check if coins are available
    if (isTrialExhausted) {
      toast({
        title: "No Coins Left",
        description:
          "You've used all your daily AI coins. Come back tomorrow for more!",
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    // Deduct one coin
    const coinUsed = useTrialIfAvailable();
    if (!coinUsed) {
      toast({
        title: "No Coins Left",
        description:
          "You've used all your daily AI coins. Come back tomorrow for more!",
        variant: "destructive",
        className: "bg-white",
      });
      return;
    }

    setCurrentAiIndex(index);
    setIsAiLoading(true);

    try {
      const result = await generateEducationDescription(
        `${education.universityName} on ${education.degree} in ${education.major}`,
        user.id
      );

      setAiGeneratedDescriptionList(result);

      setTimeout(function () {
        listRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error: any) {
      if (error.message?.startsWith("RATE_LIMIT_EXCEEDED:")) {
        toast({
          title: "Daily Quota Exhausted",
          description: error.message.replace("RATE_LIMIT_EXCEEDED:", ""),
          variant: "destructive",
          className: "bg-white",
        });
      } else if (error.message?.startsWith("AI_ERROR:")) {
        toast({
          title: "AI Service Error",
          description: error.message.replace("AI_ERROR:", ""),
          variant: "destructive",
          className: "bg-white",
        });
      } else {
        toast({
          title: "Error generating description",
          description: error.message || "Please try again later.",
          variant: "destructive",
          className: "bg-white",
        });
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSave = async (data: z.infer<typeof EducationValidationSchema>) => {
    setIsLoading(true);

    const result = await addEducationToResume(params.id, data.education);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Educational details updated successfully.",
        className: "bg-white",
      });
      handleInputChange({
        target: {
          name: "education",
          value: data.education,
        },
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
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary-700 border-t-4 bg-neutral-900 border border-neutral-800">
        <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
          Education
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Add your educational details
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="mt-5">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-neutral-700 p-3 my-5 rounded-lg"
              >
                {educationFields.map((config) => (
                  <FormField
                    key={config.name}
                    control={form.control}
                    name={`education.${index}.${config.name}`}
                    render={({ field }) => (
                      <FormItem className={config.colSpan || ""}>
                        {config.type === "textarea" ? (
                          <div className="flex justify-between items-end">
                            <FormLabel className="text-neutral-300 font-semibold text-md">
                              {config.label}:
                            </FormLabel>
                            <Button
                              variant="outline"
                              onClick={() =>
                                generateEducationDescriptionFromAI(index)
                              }
                              type="button"
                              size="sm"
                              className="border-primary text-primary flex gap-2 bg-transparent hover:bg-neutral-800"
                              disabled={isAiLoading}
                            >
                              {isAiLoading && currentAiIndex === index ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Brain className="h-4 w-4" />
                              )}{" "}
                              Generate from AI
                            </Button>
                          </div>
                        ) : (
                          <FormLabel className="text-neutral-300 font-semibold text-md">
                            {config.label}:
                          </FormLabel>
                        )}
                        <FormControl>
                          {config.type === "textarea" ? (
                            <Textarea
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleChange(index, e);
                              }}
                              defaultValue={(field.value as string) || ""}
                              className={`no-focus bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 ${
                                form.formState.errors.education?.[index]?.[
                                  config.name
                                ]
                                  ? "border-red-500"
                                  : ""
                              }`}
                              rows={6}
                            />
                          ) : (
                            <Input
                              type={config.type}
                              {...field}
                              value={field.value as string}
                              className={`no-focus bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 ${
                                form.formState.errors.education?.[index]?.[
                                  config.name
                                ]
                                  ? "border-red-500"
                                  : ""
                              }`}
                              onChange={(e) => {
                                field.onChange(e);
                                handleChange(index, e);
                              }}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            ))}
            <div className="mt-3 flex gap-2 justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={AddNewEducation}
                  className="text-primary bg-transparent hover:bg-neutral-800 border-primary"
                  type="button"
                >
                  <Plus className="size-4 mr-2" /> Add More
                </Button>
                <Button
                  variant="outline"
                  onClick={() => RemoveEducation(fields.length - 1)}
                  className="text-primary bg-transparent hover:bg-neutral-800 border-primary"
                  type="button"
                >
                  <Minus className="size-4 mr-2" /> Remove
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="bg-primary-700 hover:bg-primary-800 text-white"
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

      {aiGeneratedDescriptionList.length > 0 && (
        <div className="my-5" ref={listRef}>
          <h2 className="font-bold text-lg text-white">Suggestions</h2>
          {aiGeneratedDescriptionList?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                form.setValue(
                  `education.${currentAiIndex}.description`,
                  item?.description,
                  { shouldValidate: true }
                );
                handleInputChange({
                  target: {
                    name: "education",
                    value: form.getValues("education"),
                  },
                });
              }}
              className={`p-5 shadow-lg my-4 rounded-lg border-t-2 bg-neutral-900 border border-neutral-800 ${
                isAiLoading
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-neutral-800"
              }`}
              aria-disabled={isAiLoading}
            >
              <h2 className="font-semibold my-1 text-primary">
                Level: {item?.activity_level}
              </h2>
              <p className="text-justify text-neutral-300">
                {item?.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationForm;
