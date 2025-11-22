"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Header = () => {
  const user = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[radial-gradient(35%_80%_at_30%_0%,hsl(var(--foreground)/.1),transparent)] backdrop-blur-md border-b border-white/10">
      <nav className="px-6 py-3">
        <div className="flex items-center justify-between mx-auto max-w-screen-xl">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <img src="/icons/logo.svg" className="h-6" alt="logo" />
              <span className="ml-2 text-base font-bold text-white whitespace-nowrap">
                OatMeal
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                href="/#learn-more"
                className="text-gray-400 hover:text-white text-xs font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-white text-xs font-medium transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-6">
            {user?.isLoaded && !user?.isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="text-white hover:text-white/80 text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center">
                  <UserButton showName={false} />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
