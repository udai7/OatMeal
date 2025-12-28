"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    avatar?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <FAQCard key={`${item.name}-${idx}`} item={item} />
        ))}
      </ul>
    </div>
  );
};

const FAQCard = ({
  item,
}: {
  item: {
    quote: string;
    name: string;
    title: string;
    avatar?: string;
  };
}) => {
  return (
    <li className="relative w-[280px] sm:w-[350px] md:w-[450px] max-w-full shrink-0 rounded-2xl border border-zinc-700 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-6 sm:px-8 py-6 overflow-visible transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] group">
      <blockquote>
        <div className="relative z-20 mb-6 flex flex-row items-center gap-3">
          {item.avatar && (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: item.avatar }}
            >
              {item.name.charAt(0)}
            </div>
          )}
          <span className="flex flex-col gap-1">
            <span className="text-sm leading-[1.6] font-bold text-white">
              {item.name}
            </span>
            <span className="text-sm leading-[1.6] font-normal text-gray-400">
              {item.title}
            </span>
          </span>
        </div>
        <span className="relative z-20 text-sm leading-[1.6] font-normal text-gray-100">
          {item.quote}
        </span>
      </blockquote>
    </li>
  );
};
