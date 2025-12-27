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
      <div className="relative mt-10 w-full max-w-[1400px]">
        <div className="flex gap-4 items-start">
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
              <div className="relative z-20 h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                <img
                  src="/icons/document-scan.svg"
                  alt="ATS Test"
                  className="h-8 w-8 invert"
                />
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
