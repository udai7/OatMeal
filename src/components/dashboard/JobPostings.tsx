"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_JOBS = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "TechCorp Inc.",
        location: "Remote",
    },
    {
        id: 2,
        title: "React Native Engineer",
        company: "MobileFirst",
        location: "New York, NY",
    },
    {
        id: 3,
        title: "UI/UX Designer",
        company: "Creative Studio",
        location: "San Francisco, CA",
    },
    {
        id: 4,
        title: "Full Stack Developer",
        company: "StartupX",
        location: "Remote",
    },
    {
        id: 5,
        title: "Product Designer",
        company: "Designify",
        location: "London, UK",
    },
];

const JobPostings = () => {
    return (
        <div className="w-full rounded-3xl bg-black border border-neutral-800 overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="relative h-40 w-full bg-neutral-900 overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/20 to-black z-10" />
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#404040_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute bottom-4 left-6 z-20">
                    <h3 className="text-2xl font-bold text-white">Job Matches</h3>
                    <p className="text-gray-400 text-sm">Based on your resume</p>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="space-y-2 mb-6">
                    <h2 className="text-xl font-bold text-white">
                        Recommended Roles
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Curated opportunities matching your skills and experience level.
                    </p>
                </div>

                <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    {MOCK_JOBS.map((job) => (
                        <div key={job.id} className="flex items-start gap-3 group/job cursor-pointer">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5 group-hover/job:text-green-400 transition-colors" />
                            <div>
                                <h4 className="text-white font-medium text-sm leading-none mb-1 group-hover/job:text-blue-400 transition-colors">
                                    {job.title}
                                </h4>
                                <p className="text-gray-500 text-xs">
                                    {job.company} • {job.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-6 mt-auto">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-semibold h-12 transition-transform active:scale-95">
                        View all jobs
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-3">
                        Updated just now
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobPostings;
