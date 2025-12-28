import React, { use } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import { currentUser } from "@clerk/nextjs/server";
import { checkResumeOwnership } from "@/lib/actions/resume.actions";
import { redirect } from "next/navigation";
import ResumeEditor from "@/components/layout/my-resume/ResumeEditor";
import { FileEdit } from "lucide-react";

const EditResume = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const isResumeOwner = await checkResumeOwnership(user?.id || "", params.id);

  if (!isResumeOwner) {
    return redirect("/dashboard");
  }

  return (
    <PageWrapper>
      <Header />
      <div className="mt-16 sm:mt-20 mb-4 sm:mb-8 mx-4 sm:mx-10 md:mx-20 lg:mx-36">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
          <div className="p-2 sm:p-2.5 bg-primary-700/20 border border-primary-700/30 rounded-xl">
            <FileEdit className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
          </div>
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white">
            Edit Your Resume
          </h2>
        </div>
        <p className="text-center text-sm sm:text-base text-neutral-400">
          Please provide the necessary information for your resume.
        </p>
      </div>
      <ResumeEditor params={params} userId={user?.id} />
    </PageWrapper>
  );
};

export default EditResume;
