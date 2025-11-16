"use client";

import Header from "@/components/layout/Header";
import { useUser } from "@clerk/nextjs";
import { ArrowBigUp, AtomIcon, Edit, Share2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import FeaturesSectionDemo from "@/components/ui/features-section-demo-2";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { DotScreenShader } from "@/components/ui/dot-shader-background";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { GradientButton } from "@/components/ui/gradient-button";

const page = () => {
  const user = useUser();

  return (
    <div className="bg-black min-h-screen font-poppins">
      <Header />
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <DotScreenShader />
        </div>
        <div className="relative z-10 py-8 px-6 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 md:px-10">
          <h1 className="mt-4 lg:mt-8 mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-7xl mix-blend-exclusion">
            Build Your Resume{" "}
            <span className="text-primary-500 max-sm:block">With AI</span>
          </h1>
          <p className="mb-8 text-lg font-light text-gray-300 lg:text-xl sm:px-16 xl:px-48 mix-blend-exclusion">
            Effortlessly Craft a Professional Resume with Our AI-Powered Builder
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <GradientButton variant="variant" asChild>
              <Link href={`${!user?.isSignedIn ? "/sign-up" : "/dashboard"}`}>
                Get Started
              </Link>
            </GradientButton>
            <GradientButton variant="black" asChild>
              <Link href="#learn-more">Learn more</Link>
            </GradientButton>
          </div>
        </div>
      </section>
      <section className="py-8 px-6 mx-auto max-w-screen-xl text-center lg:py-8 lg:px-12 md:px-10">
        <h2 className="font-bold text-3xl text-white" id="learn-more">
          How it Works?
        </h2>
        <h2 className="text-md text-gray-400 mb-8">
          Generate resume in just 3 steps
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 place-items-center">
          <CardSpotlight className="h-96 w-full max-w-sm text-left">
            <p className="text-xl font-bold relative z-20 mt-2 text-white">
              Create Your Template
            </p>
            <div className="text-neutral-200 mt-4 relative z-20">
              Follow these steps to create your resume:
              <ul className="list-none mt-2">
                <Step title="Select your color scheme" />
                <Step title="Choose template style" />
                <Step title="Customize layout options" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-sm">
              Our professionally designed template ensures a clean and
              consistent look for all users.
            </p>
          </CardSpotlight>

          <CardSpotlight className="h-96 w-full max-w-sm text-left">
            <p className="text-xl font-bold relative z-20 mt-2 text-white">
              Update Your Information
            </p>
            <div className="text-neutral-200 mt-4 relative z-20">
              Fill in your resume details:
              <ul className="list-none mt-2">
                <Step title="Enter personal details" />
                <Step title="Add work experience" />
                <Step title="Include education" />
                <Step title="List your skills" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-sm">
              Our AI assists you in filling out each section accurately and
              effectively.
            </p>
          </CardSpotlight>

          <CardSpotlight className="h-96 w-full max-w-sm text-left">
            <p className="text-xl font-bold relative z-20 mt-2 text-white">
              Share Your Resume
            </p>
            <div className="text-neutral-200 mt-4 relative z-20">
              Share your resume with employers:
              <ul className="list-none mt-2">
                <Step title="Save your resume securely" />
                <Step title="Generate shareable link" />
                <Step title="Download in preferred format" />
                <Step title="Update anytime" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-sm">
              Easily share your resume and make updates whenever needed.
            </p>
          </CardSpotlight>
        </div>
      </section>
      <section className="py-8 px-6 mx-auto max-w-screen-xl lg:py-16 lg:px-12 md:px-10">
        <h2 className="font-bold text-3xl text-center text-white">
          Powerful Features
        </h2>
        <h2 className="text-md text-gray-400 text-center mb-8">
          Everything you need to build a professional resume
        </h2>
        <FeaturesSectionDemo />
      </section>
      <MinimalFooter />
    </div>
  );
};

const Step = ({ title }: { title: string }) => {
  return (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-white">{title}</p>
    </li>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-blue-500 mt-1 shrink-0"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
};

export default page;
