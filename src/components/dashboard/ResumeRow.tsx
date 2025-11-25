"use client";

import AddResume from "@/components/common/AddResume";
import ResumeCard from "@/components/common/ResumeCard";
import { fetchUserResumes } from "@/lib/actions/resume.actions";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ResumeRow = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState(null as any);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const getTotalItems = () => {
    if (resumeList === null) return 1 + 3; // Add + 3 Skeletons
    return 1 + resumeList.length; // Add + Resumes
  };

  const totalItems = getTotalItems();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderItem = (index: number) => {
    // 1. Add Resume Card (Always index 0)
    if (index === 0) {
      return <AddResume userId={userId} />;
    }

    // 2. Resume Cards
    const resumeIndex = index - 1;
    const isLoading = resumeList === null;
    const resumeCount = isLoading ? 3 : resumeList.length;

    if (resumeIndex < resumeCount) {
      return (
        <ResumeCard
          resume={isLoading ? null : JSON.stringify(resumeList[resumeIndex])}
          refreshResumes={loadResumeData}
        />
      );
    }

    return null;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = Array.from(
    { length: endIndex - startIndex },
    (_, i) => startIndex + i
  );

  return (
    <div className="w-full pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {currentItems.map((index) => (
          <div key={index}>{renderItem(index)}</div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ResumeRow;
