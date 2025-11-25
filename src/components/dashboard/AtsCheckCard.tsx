"use client";

import React from "react";
import Link from "next/link";
import { CardSpotlight } from "../ui/card-spotlight";

const AtsCheckCard = () => {
    return (
        <div className="h-full w-full">
            <Link href="/ats-test" className="block h-full">
                <CardSpotlight className="h-full w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors rounded-xl">
                    <div className="relative z-20 h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center">
                        <img src="/icons/document-scan.svg" alt="ATS Test" className="h-8 w-8 invert" />
                    </div>
                    <h3 className="relative z-20 mt-4 text-lg font-semibold text-center text-white">ATS Test</h3>
                    <p className="relative z-20 text-sm text-center text-gray-400 mt-2">
                        Check if your resume will pass through ATS systems
                    </p>
                </CardSpotlight>
            </Link>
        </div>
    );
};

export default AtsCheckCard;
