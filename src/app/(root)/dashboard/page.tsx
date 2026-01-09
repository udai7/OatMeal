"use client";

import PageWrapper from "@/components/common/PageWrapper";
import Header from "@/components/layout/Header";
import React, { useState, useEffect } from "react";
import DashboardCards from "@/components/layout/DashboardCards";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

import CoverLetterGenerator from "@/components/dashboard/CoverLetterGenerator";

const Dashboard = () => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowBanner(window.scrollY < 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PageWrapper>
      <Header />
      {/* Premium Features Banner */}
      <div
        className={`fixed top-[60px] left-0 right-0 z-40 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 py-2 transition-all duration-300 overflow-hidden ${
          showBanner
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        }`}
      >
        {/* Desktop - static */}
        <p className="hidden sm:block text-center text-sm font-semibold text-white">
          🎉 All premium features are temporarily free! 🎉
        </p>
        {/* Mobile - marquee */}
        <div className="sm:hidden overflow-hidden whitespace-nowrap">
          <p className="inline-block animate-marquee text-sm font-semibold text-white">
            🎉 All premium features are temporarily free! 🎉
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🎉 All premium features are
            temporarily free! 🎉 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
        </div>
      </div>
      <div
        className={`${
          showBanner ? "pt-32" : "pt-24"
        } px-4 md:px-8 lg:px-12 pb-8 transition-all duration-300`}
      >
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
