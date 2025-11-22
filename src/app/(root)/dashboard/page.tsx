import PageWrapper from "@/components/common/PageWrapper";
import DashboardCards from "@/components/layout/DashboardCards";
import DashboardFeatures from "@/components/layout/DashboardFeatures";
import Header from "@/components/layout/Header";
import React from "react";

const Dashboard = () => {
  return (
    <PageWrapper>
      <Header />
      <div className="my-10 !mb-0 mx-10 md:mx-20 lg:mx-36 pt-24">
        <h2 className="text-center text-2xl font-bold text-white">
          Your Resume Dashboard
        </h2>
        <p className="text-center text-gray-400">
          Begin creating and managing your personalized resumes.
        </p>
      </div>
      <div className="p-10 md:px-24 lg:px-48">
        <DashboardCards />
      </div>
      <div className="px-10 md:px-24 lg:px-48 pb-20">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Explore Features</h3>
        <DashboardFeatures />
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
