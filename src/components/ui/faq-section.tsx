"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";

export default function FAQSection() {
  const firstRow = faqs.slice(0, faqs.length / 2);
  const secondRow = faqs.slice(faqs.length / 2);

  return (
    <section className="relative py-16 px-6 mx-auto max-w-screen-xl overflow-hidden bg-black font-poppins">
      <div className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
      </div>
      <div className="relative z-10 text-center mb-12">
        <h2 className="font-bold text-4xl text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 text-lg">
          What our users are saying about their experience
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <InfiniteMovingCards items={firstRow} direction="right" speed="slow" />
        <InfiniteMovingCards items={secondRow} direction="left" speed="slow" />
      </div>
    </section>
  );
}

const faqs = [
  {
    quote:
      "How easy is it to create a resume with your AI builder? It's incredibly simple! Just input your information, and our AI will format it professionally in minutes.",
    name: "Sarah Johnson",
    title: "Software Engineer",
    avatar: "#6366f1",
  },
  {
    quote:
      "Can I customize the templates to match my style? Absolutely! We offer unlimited customization options including colors, fonts, layouts, and sections.",
    name: "Michael Chen",
    title: "Product Manager",
    avatar: "#ec4899",
  },
  {
    quote:
      "Is my data secure and private? Yes! We use enterprise-grade encryption and never share your personal information with third parties.",
    name: "Emily Rodriguez",
    title: "Marketing Director",
    avatar: "#f59e0b",
  },
  {
    quote:
      "How does the ATS scanner work? Our ATS scanner analyzes your resume against job descriptions and provides optimization suggestions to improve your match score.",
    name: "David Park",
    title: "Data Analyst",
    avatar: "#10b981",
  },
  {
    quote:
      "Can I download my resume in different formats? Yes! Export your resume as PDF, Word, or get a shareable link. All formats are optimized for ATS systems.",
    name: "Jessica Taylor",
    title: "UX Designer",
    avatar: "#8b5cf6",
  },
  {
    quote:
      "What makes your AI different from others? Our AI is trained on millions of successful resumes and provides context-aware suggestions specific to your industry.",
    name: "Robert Kim",
    title: "Financial Analyst",
    avatar: "#ef4444",
  },
];
