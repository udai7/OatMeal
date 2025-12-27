"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ArrowRight,
  Sparkles,
  PenLine,
  Download,
  Target,
} from "lucide-react";
import Link from "next/link";

const CoverLetterGenerator = () => {
  const features = [
    {
      icon: Target,
      title: "Job-Targeted",
      description: "Analyzes job descriptions to highlight relevant skills",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Uses Gemini 2.5 Flash for intelligent content generation",
    },
    {
      icon: PenLine,
      title: "Fully Editable",
      description: "Review and customize before finalizing",
    },
    {
      icon: Download,
      title: "PDF Export",
      description: "Download professional, print-ready documents",
    },
  ];

  return (
    <div className="w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-neutral-800 bg-black p-6"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-700/20 border border-primary-700/30 rounded-xl">
              <FileText className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Cover Letter Generator
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Create personalized, professional cover letters that stand out
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <feature.icon className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How it works */}
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-neutral-900/30 border border-neutral-800">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-700/20 border border-primary-700/40 flex items-center justify-center text-xs text-primary-500 font-medium">
                  1
                </span>
                <span className="text-xs text-neutral-400">Select Resume</span>
              </div>
              <div className="w-8 h-px bg-neutral-800" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-700/20 border border-primary-700/40 flex items-center justify-center text-xs text-primary-500 font-medium">
                  2
                </span>
                <span className="text-xs text-neutral-400">
                  Add Job Details
                </span>
              </div>
              <div className="w-8 h-px bg-neutral-800" />
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary-700/20 border border-primary-700/40 flex items-center justify-center text-xs text-primary-500 font-medium">
                  3
                </span>
                <span className="text-xs text-neutral-400">
                  Generate & Download
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/cover-letter" className="w-full">
            <Button className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium h-11 rounded-lg transition-all hover:scale-[1.01]">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Cover Letter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CoverLetterGenerator;
