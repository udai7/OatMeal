"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const user = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[radial-gradient(35%_80%_at_30%_0%,hsl(var(--foreground)/.1),transparent)] backdrop-blur-md border-b border-white/10">
      <nav className="px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between mx-auto">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link href="/" className="flex items-center">
              <img
                src="/icons/cat-removebg-preview.png"
                className="h-8 sm:h-9 brightness-0 invert"
                alt="logo"
              />
              <span className="ml-2 text-base sm:text-lg font-bold text-white whitespace-nowrap">
                OatMeal
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/#learn-more"
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user?.isLoaded && !user?.isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-white/80 hover:text-white text-base font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="text-white hover:text-white/80 text-base font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-white text-base font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center">
                  <UserButton showName={false} />
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/#learn-more"
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              {user?.isLoaded && !user?.isSignedIn ? (
                <>
                  <Link
                    href="/sign-in"
                    className="text-white/80 hover:text-white text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-white hover:text-white/80 text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white/80 hover:text-white text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
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
        )}
      </nav>
    </header>
  );
};

export default Header;
