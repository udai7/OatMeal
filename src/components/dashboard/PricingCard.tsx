"use client";

import React from "react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

export default function PricingCard() {
    return (
        <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-center w-full p-4 relative min-h-[600px] bg-neutral-900 rounded-xl">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <div className="w-full h-64 flex items-center justify-center">
                <EvervaultCard text="Premium" className="aspect-auto h-full w-full" />
            </div>

            <h2 className="dark:text-white text-black mt-6 text-sm font-light text-center px-2 leading-relaxed">
                Upgrade to Premium for unlimited AI cover letters, resume analysis, and more.
            </h2>
            <button className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-6 text-black dark:text-white px-6 py-2 hover:bg-white hover:text-black transition-colors">
                Upgrade Now
            </button>
        </div>
    );
}
