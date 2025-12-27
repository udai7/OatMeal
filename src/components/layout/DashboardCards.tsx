"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "../ui/card";
import { CardSpotlight } from "../ui/card-spotlight";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Show 4 items, but the container width will clip the 4th one to show "3.5"

  const totalPages = resumeList ? Math.ceil(resumeList.length / itemsPerPage) : 0;
  const currentResumes = resumeList
    ? resumeList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    : [];

  return (
    <>
      <div className="relative mt-10">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-[240px]">
            <AddResume userId={userId} />
          </div>

          <div className="flex flex-col gap-4">
            {/* Width calculation: 3.5 cards * 240px + 3 gaps * 16px = 840 + 48 = 888px */}
            <div className="w-[888px] overflow-hidden">
              <div className="flex gap-4">
                {resumeList !== null
                  ? currentResumes.map((resume: any) => (
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
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>

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
