"use client";

import { Loader2, PlusSquare } from "lucide-react";
import { FileUpload } from "../ui/file-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { ResumeNameValidationSchema } from "@/lib/validations/resume";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createResume } from "@/lib/actions/resume.actions";
import { toast } from "../ui/use-toast";
import { useRouter } from "next-nprogress-bar";

const AddResume = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResumeNameValidationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ResumeNameValidationSchema>
  ) => {
    if (userId === undefined) {
      return;
    }

    setIsLoading(true);

    const uuid = uuidv4();

    const result = await createResume({
      resumeId: uuid,
      userId: userId,
      title: values.name,
      templateId: "standard", // Using default template
    });

    if (result.success) {
      form.reset();
      setOpenDialog(false);

      const resume = JSON.parse(result.data!);

      // Show toast before redirecting
      toast({
        title: "Resume created!",
        description: "Now you can add your details to the resume.",
        className: "bg-black text-white border-neutral-800",
      });

      router.push(`/my-resume/${resume.resumeId}/edit`);
    } else {
      setIsLoading(false);

      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="w-full h-[280px] sm:h-[300px] lg:w-[240px] lg:h-[340px] flex items-center justify-center">
        <FileUpload onClick={() => userId && setOpenDialog(true)} />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Resume</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Enter a title for your new resume
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="comment-form"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <p className="mt-2 mb-3 text-neutral-300 font-semibold">
                        Resume Title:
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Example: Android Developer Resume"
                        className={`no-focus bg-neutral-800 text-white placeholder:text-neutral-500 ${
                          form.formState.errors.name
                            ? "border-red-500"
                            : "border-neutral-700"
                        }`}
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-10 flex justify-end gap-5">
                <button
                  type="button"
                  onClick={() => {
                    setOpenDialog(false);
                    form.reset({ name: "" });
                  }}
                  className="btn-ghost text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                  className="bg-primary-700 hover:bg-primary-800 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Creating Resume...
                    </>
                  ) : (
                    "Create Resume"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddResume;
