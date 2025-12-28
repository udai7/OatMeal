"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "../ui/card";
import { CardSpotlight } from "../ui/card-spotlight";
import { motion } from "motion/react";
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
  const itemsPerPage = 3; // Show 3 items fully, and the 4th one partially

  const totalPages = resumeList
    ? Math.ceil(resumeList.length / itemsPerPage)
    : 0;
  const currentResumes = resumeList
    ? resumeList.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + 4
      )
    : [];

  return (
    <>
      <div className="relative mt-6 sm:mt-10 w-full max-w-[1400px]">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AddResume userId={userId} />
            <Link href="/ats-test" className="w-full">
              <motion.div
                whileHover="animate"
                className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-neutral-900 dark:border-white/[0.2] border-black/[0.1] w-full h-[280px] sm:h-[300px] rounded-xl p-4 sm:p-6 border flex flex-col items-center justify-center"
              >
                <div className="absolute -inset-[1px] z-0 pointer-events-none">
                  <motion.div
                    variants={{
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                    }}
                    className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent rounded-xl"
                  ></motion.div>
                </div>
                <div className="relative z-20 p-3 sm:p-4 bg-primary-700/20 border border-primary-700/30 rounded-xl mb-3 sm:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 sm:h-7 sm:w-7 text-primary-500"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="relative z-20 text-base sm:text-lg font-semibold text-center text-white">
                  ATS Test
                </h3>
                <p className="relative z-20 text-xs sm:text-sm text-center text-gray-400 mt-1 sm:mt-2">
                  Check if your resume will pass through ATS systems
                </p>
              </motion.div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resumeList !== null
              ? resumeList.map((resume: any) => (
                  <ResumeCard
                    key={resume.resumeId}
                    resume={JSON.stringify(resume)}
                    refreshResumes={loadResumeData}
                  />
                ))
              : [1, 2].map((index) => (
                  <ResumeCard
                    key={index}
                    resume={null}
                    refreshResumes={loadResumeData}
                  />
                ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-4 items-start">
          <div className="flex-shrink-0 w-[240px]">
            <AddResume userId={userId} />
          </div>

          <div className="flex flex-col gap-4">
            {/* Width calculation: 3.5 cards * 240px + 3 gaps * 16px = 840 + 48 = 888px */}
            <div className="w-[888px] overflow-hidden relative [mask-image:linear-gradient(to_right,black_90%,transparent)]">
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
            <motion.div
              whileHover="animate"
              className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-neutral-900 dark:border-white/[0.2] border-black/[0.1] w-full h-[340px] rounded-xl p-6 border flex flex-col items-center justify-center"
            >
              <div className="absolute -inset-[1px] z-0 pointer-events-none">
                <motion.div
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                  }}
                  className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent rounded-xl"
                ></motion.div>
              </div>
              <div className="relative z-20 p-4 bg-primary-700/20 border border-primary-700/30 rounded-xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 text-primary-500"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="m9 15 2 2 4-4" />
                </svg>
              </div>
              <h3 className="relative z-20 text-lg font-semibold text-center text-white">
                ATS Test
              </h3>
              <p className="relative z-20 text-sm text-center text-gray-400 mt-2">
                Check if your resume will pass through ATS systems
              </p>
            </motion.div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardCards;
