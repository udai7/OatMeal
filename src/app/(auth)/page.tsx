"use client";

import Header from "@/components/layout/Header";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  ArrowBigUp,
  ArrowRight,
  AtomIcon,
  Edit,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import FeaturesSectionDemo from "@/components/ui/features-section-demo-2";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { DotScreenShader } from "@/components/ui/dot-shader-background";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { GradientButton } from "@/components/ui/gradient-button";
import { Spotlight } from "@/components/ui/spotlight-new";
import PricingSection4 from "@/components/ui/pricing-section-4";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import FAQSection from "@/components/ui/faq-section";

const page = () => {
  const user = useUser();

  return (
    <div className="bg-black min-h-screen font-poppins">
      <Header />
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-20 pb-10">
        <Spotlight />
        <div className="relative z-10 py-8 px-6 sm:px-8 mx-auto max-w-7xl text-center lg:py-16 lg:px-12 md:px-10">
          {/* Badge */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 mb-6 text-xs sm:text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer group">
            <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
            <span className="group-hover:text-blue-300 transition-colors font-medium">
              NEW: AI Resume Builder
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight text-white max-w-5xl mx-auto">
            Boost{" "}
            <span className="gradient-button gradient-button-variant inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl mx-2 align-middle shadow-lg shadow-blue-500/30 rotate-3">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </span>{" "}
            Your Career <br className="hidden md:block" />
            with AI-Powered Resumes
          </h1>

          {/* Subheading */}
          <p className="mb-8 text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-gray-400 leading-relaxed px-4">
            Create professional resumes and cover letters in seconds. Our
            AI-powered platform helps you land your dream job with ease.
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center space-y-4 w-full sm:w-auto px-4">
            <GradientButton
              variant="variant"
              asChild
              className="px-6 py-4 text-base sm:px-8 sm:py-6 sm:text-lg w-full sm:w-auto"
            >
              <Link href={`${!user?.isSignedIn ? "/sign-up" : "/dashboard"}`}>
                Build Your Resume Free &rarr;
              </Link>
            </GradientButton>
            <p className="text-sm text-gray-500 font-medium">
              &#123; No credit card required &#125;
            </p>
          </div>

          {/* Dashboard Preview Image */}
          <div className="relative mt-20 mx-auto max-w-7xl w-full group">
            {/* Static Logos Removed */}

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-white/10 rounded-xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm shadow-2xl">
              <Image
                src="/image.png"
                alt="Dashboard Preview"
                width={1200}
                height={800}
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />

              {/* Hover Overlay & Button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                <Link href={!user?.isSignedIn ? "/sign-in" : "/dashboard"}>
                  <button className="px-6 py-3 bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 rounded-xl font-medium transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl backdrop-blur-md flex items-center gap-2">
                    Make your First Resume
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-8 px-4 sm:px-6 mx-auto max-w-screen-xl text-center lg:py-8 lg:px-12 md:px-10 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
          <SparklesComp
            density={1800}
            direction="bottom"
            speed={1}
            color="#FFFFFF"
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          />
        </div>

        <h2
          className="font-bold text-2xl sm:text-3xl text-white relative z-10"
          id="learn-more"
        >
          How it Works?
        </h2>
        <h2 className="text-sm sm:text-md text-gray-400 mb-6 sm:mb-8 relative z-10">
          Generate resume in just 3 steps
        </h2>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 place-items-center relative z-10 px-2 sm:px-0">
          <CardSpotlight className="h-auto min-h-[320px] sm:h-96 w-full max-w-sm text-left">
            <p className="text-lg sm:text-xl font-bold relative z-20 mt-2 text-white">
              Create Your Resume
            </p>
            <div className="text-neutral-200 mt-4 relative z-20">
              Follow these steps to create your resume:
              <ul className="list-none mt-2">
                <Step title="Select your color scheme" />
                <Step title="Choose your preferred font" />
                <Step title="Start with your details" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-sm">
              Our professionally designed template ensures a clean and
              consistent look for all users.
            </p>
          </CardSpotlight>

          <CardSpotlight className="h-auto min-h-[320px] sm:h-96 w-full max-w-sm text-left">
            <p className="text-lg sm:text-xl font-bold relative z-20 mt-2 text-white">
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

          <CardSpotlight className="h-auto min-h-[320px] sm:h-96 w-full max-w-sm text-left">
            <p className="text-lg sm:text-xl font-bold relative z-20 mt-2 text-white">
              Download & Apply
            </p>
            <div className="text-neutral-200 mt-4 relative z-20">
              Finalize and use your resume:
              <ul className="list-none mt-2">
                <Step title="Check ATS compatibility" />
                <Step title="Generate cover letter" />
                <Step title="Download as PDF" />
                <Step title="Update anytime" />
              </ul>
            </div>
            <p className="text-neutral-300 mt-4 relative z-20 text-sm">
              Easily download your resume and make updates whenever needed.
            </p>
          </CardSpotlight>
        </div>
      </section>
      <section className="relative py-8 px-4 sm:px-6 mx-auto max-w-screen-xl lg:pb-4 lg:px-12 md:px-10 overflow-hidden">
        <div className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
        </div>
        <h2 className="font-bold text-2xl sm:text-3xl text-center text-white relative z-10">
          Powerful Features
        </h2>
        <h2 className="text-sm sm:text-md text-gray-400 text-center mb-6 sm:mb-8 relative z-10">
          Everything you need to build a professional resume
        </h2>
        <div className="relative z-10">
          <FeaturesSectionDemo />
        </div>
      </section>
      <PricingSection4 />
      {/* FAQ hidden on mobile */}
      <div className="hidden md:block">
        <FAQSection />
      </div>
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
