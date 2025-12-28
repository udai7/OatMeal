"use client";

import { FormProvider } from "@/lib/context/FormProvider";
import React from "react";
import ResumeEditForm from "./ResumeEditForm";
import ResumePreview from "./ResumePreview";

const ResumeEditor = ({
  params,
  userId,
}: {
  params: { id: string };
  userId: string | undefined;
}) => {
  if (!userId) {
    return null;
  }

  return (
    <FormProvider params={params}>
      <div className="px-4 sm:px-6 lg:px-10 pt-6 lg:pt-10 pb-2 lg:h-[calc(100vh-50px)] overflow-auto lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 justify-center items-start h-auto lg:h-[calc(100%-5px)] overflow-visible lg:overflow-hidden">
          <div className="h-auto lg:h-full overflow-visible lg:overflow-y-auto no-scrollbar p-1">
            <ResumeEditForm params={params} userId={userId} />
          </div>
          <div className="h-auto lg:h-full overflow-visible lg:overflow-y-auto no-scrollbar p-1 pb-8">
            <ResumePreview />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ResumeEditor;
