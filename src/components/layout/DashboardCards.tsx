"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "../ui/card";

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-10 gap-8">
        <AddResume userId={userId} />

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

        <Link href="/ats-test" className="block hover:scale-105 transition-transform">
          <Card className="relative h-full rounded-lg overflow-hidden border-2 border-dashed border-neutral-800 bg-neutral-900/50 flex flex-col items-center justify-center p-6 hover:border-neutral-700 transition-colors">
            <div className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center">
              <img src="/icons/document-scan.svg" alt="ATS Test" className="h-8 w-8 invert" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-center text-white">ATS Test</h3>
            <p className="text-sm text-center text-gray-400 mt-2">
              Check if your resume will pass through ATS systems
            </p>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default DashboardCards;
