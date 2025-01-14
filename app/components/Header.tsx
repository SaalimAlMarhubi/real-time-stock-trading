"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SunIcon, MoonIcon } from "./icons/ThemeIcons";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 m-0 w-full border-b-4 border-accent bg-gradient-to-b from-card to-card-100 p-1 drop-shadow-md dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-between px-5 py-2 lg:justify-around">
        {/* Logo Section */}
        <a className="z-10 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-secondary to-secondary-700 px-5 py-2 text-secondary-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/heat-engineer-logo.webp"
                alt="Heat Engineer Logo"
                width={45}
                height={45}
                className="max-h-[45px] max-w-[45px]"
              />
              <div className="grid grid-cols-1 gap-y-0.5 text-center *:leading-4">
                <span className="text-2xl font-extrabold">HEAT</span>
                <span className="text-xs text-accent-200">ENGINEER</span>
              </div>
            </div>
          </div>
          <span className="hidden max-w-32 pl-3 text-xs sm:inline">
            Trading Platform
          </span>
        </a>

        {/* Navigation Links - Desktop */}
        <div className="hidden items-center justify-center gap-3 lg:flex">
          <nav className="relative z-10 hidden max-w-max flex-1 items-center justify-center lg:block">
            <div className="relative">
              <ul className="group flex flex-1 list-none items-center justify-center gap-4 space-x-1">
                <a
                  href="#"
                  className="py-2 text-sm text-white dark:text-gray-200"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="py-2 text-sm text-white dark:text-gray-200"
                >
                  Portfolio
                </a>
                <a
                  href="#"
                  className="py-2 text-sm text-white dark:text-gray-200"
                >
                  Trade History
                </a>
                <a
                  href="#"
                  className="py-2 text-sm text-white dark:text-gray-200"
                >
                  Contact
                </a>
                <button className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  Account
                </button>

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:bg-gray-800 dark:border-gray-700"
                  type="button"
                  aria-label="Toggle theme"
                >
                  <SunIcon />
                  <MoonIcon />
                </button>
              </ul>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="block lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block"
          >
            <div className="rounded-lg border border-white bg-primary p-3 hover:bg-primary-700 dark:border-gray-700">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full w-full bg-card p-4 lg:hidden dark:bg-gray-800">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-sm text-white dark:text-gray-200">
                Dashboard
              </a>
              <a href="#" className="text-sm text-white dark:text-gray-200">
                Portfolio
              </a>
              <a href="#" className="text-sm text-white dark:text-gray-200">
                Trade History
              </a>
              <a href="#" className="text-sm text-white dark:text-gray-200">
                Contact
              </a>
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80">
                Account
              </button>

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:bg-gray-800 dark:border-gray-700"
                type="button"
                aria-label="Toggle theme"
              >
                <SunIcon />
                <MoonIcon />
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
