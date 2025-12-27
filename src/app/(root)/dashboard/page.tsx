"use client";

import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import React from "react";
import DashboardCards from "@/components/layout/DashboardCards";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

import CoverLetterGenerator from "@/components/dashboard/CoverLetterGenerator";

const Dashboard = () => {
  return (
    <PageWrapper>
      <Header />
      <div className="pt-24 px-4 md:px-8 lg:px-12 min-h-screen pb-20">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">Your Resumes</h2>
            <p className="text-gray-400 mb-6">
              Manage your resumes or create a new one.
            </p>
            <DashboardCards />
          </section>

          <section className="w-full max-w-[1400px]">
            <CoverLetterGenerator />
          </section>
        </div>
      </div>
      <MinimalFooter />
    </PageWrapper>
  );
};

export default Dashboard;
