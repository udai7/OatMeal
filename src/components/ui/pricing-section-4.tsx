"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const plans = [
  {
    name: "Starter",
    description:
      "Perfect for individuals just getting started with professional resumes",
    price: 0,
    yearlyPrice: 0,
    originalPrice: 0,
    originalYearlyPrice: 0,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    includes: [
      "Free includes:",
      "5 Daily Coins (Reset at Midnight)",
      "Resume Builder",
      "AI Resume Enhancement (3 coins)",
      "ATS Scanner (1 coin)",
      "Cover Letter Generator (1 coin)",
      "PDF Export",
      "Multiple Templates",
    ],
  },
  {
    name: "Professional",
    description:
      "Best for job seekers who want advanced features and unlimited access",
    price: 0,
    yearlyPrice: 0,
    originalPrice: 12,
    originalYearlyPrice: 99,
    buttonText: "Get started",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Starter, plus:",
      "Unlimited Resumes",
      "Advanced AI Writing",
      "Color Customization",
      "Priority Support",
      "Cover Letter Builder",
    ],
  },
  {
    name: "Enterprise",
    description:
      "For teams and organizations that need bulk access and custom solutions",
    price: 0,
    yearlyPrice: 0,
    originalPrice: 48,
    originalYearlyPrice: 399,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    includes: [
      "Everything in Professional, plus:",
      "Team Management",
      "Custom Branding",
      "API Access",
      "Dedicated Support",
      "White Label Options",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10  rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full  rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Yearly</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection4() {
  const [isYearly, setIsYearly] = useState(false);

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div className="min-h-screen mx-auto relative bg-black overflow-x-hidden font-poppins">
      <div className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
      </div>
      <article className="text-center mb-6 pt-8 max-w-3xl mx-auto space-y-2 relative z-50 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white">
          Choose the Perfect Plan for Your Career
        </h2>

        <p className="text-sm sm:text-base text-gray-300">
          Trusted by thousands of job seekers. Start building your dream resume
          today.
        </p>

        <p className="text-blue-400 font-semibold text-base sm:text-lg">
          🎉 All premium features are temporarily free! 🎉
        </p>

        <div className="pt-4">
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </div>
      </article>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl gap-6 sm:gap-4 py-6 mx-auto px-4">
        {plans.map((plan, index) => (
          <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
        ))}
      </div>
    </div>
  );
}

const PricingCard = ({
  plan,
  isYearly,
}: {
  plan: (typeof plans)[number];
  isYearly: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={plan.popular ? "md:-mt-8" : ""}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative h-full rounded-2xl ${
          plan.popular ? "border border-neutral-800 p-2" : ""
        }`}
      >
        {plan.popular && (
          <GlowingEffect
            spread={40}
            glow={isHovered}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            variant="blue"
            borderWidth={2}
            movementDuration={0.3}
          />
        )}
        <Card
          className={`relative text-white border-neutral-800 flex flex-col ${
            plan.popular
              ? "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 z-20 min-h-[640px]"
              : "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 z-10 min-h-[580px]"
          }`}
        >
          <CardHeader className="text-left ">
            <div className="flex justify-between">
              <h3 className="text-3xl mb-2">{plan.name}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              {plan.originalPrice > 0 && (
                <span className="text-xl text-gray-500 line-through">
                  ${isYearly ? plan.originalYearlyPrice : plan.originalPrice}
                </span>
              )}
              <span className="text-4xl font-semibold ">
                $
                <NumberFlow
                  format={{
                    currency: "USD",
                  }}
                  value={isYearly ? plan.yearlyPrice : plan.price}
                  className="text-4xl font-semibold"
                />
              </span>
              <span className="text-gray-300 ml-1">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-4">{plan.description}</p>
          </CardHeader>

          <CardContent className="pt-0 flex-1 flex flex-col">
            <GradientButton
              variant={plan.popular ? "variant" : "black"}
              className="w-full mb-6"
            >
              {plan.buttonText}
            </GradientButton>

            <div className="space-y-3 pt-4 border-t border-neutral-700">
              <h4 className="font-medium text-base mb-3">{plan.includes[0]}</h4>
              <ul className="space-y-2">
                {plan.includes.slice(1).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 bg-neutral-500 rounded-full grid place-content-center"></span>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
