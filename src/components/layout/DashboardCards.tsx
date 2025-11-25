"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "../ui/card";
import { CardSpotlight } from "../ui/card-spotlight";

const DashboardCards = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState(null as any);

  const loadResumeData = async () => {
    try {
      const resumeData = await fetchUserResumes(userId || "");

      setResumeList(JSON.parse(resumeData as any));
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  useEffect(() => {
    user?.isSignedIn && loadResumeData();
  }, [user?.isLoaded]);

  return (
    <>
      <div className="relative mt-10 overflow-hidden">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900 flex-nowrap">
          <div className="flex-shrink-0 w-[240px]">
            <AddResume userId={userId} />
          </div>

          {resumeList !== null
            ? resumeList.map((resume: any) => (
                <ResumeCard
                  key={resume.resumeId}
                  resume={JSON.stringify(resume)}
                  refreshResumes={loadResumeData}
                />
              ))
            : [1, 2, 3].map((index) => (
                <ResumeCard
                  key={index}
                  resume={null}
                  refreshResumes={loadResumeData}
                />
              ))}

          <Link href="/ats-test" className="flex-shrink-0 w-[240px]">
            <CardSpotlight className="h-[340px] w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
              <div className="relative z-20 h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center">
                <img
                  src="/icons/document-scan.svg"
                  alt="ATS Test"
                  className="h-8 w-8 invert"
                />
              </div>
              <h3 className="relative z-20 mt-4 text-lg font-semibold text-center text-white">
                ATS Test
              </h3>
              <p className="relative z-20 text-sm text-center text-gray-400 mt-2">
                Check if your resume will pass through ATS systems
              </p>
            </CardSpotlight>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardCards;
