"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SunIcon, MoonIcon } from "./icons/ThemeIcons";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
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
    <header className="sticky top-0 z-50 m-0 w-full border-b-4 border-accent bg-gradient-to-b from-card to-card-100 p-1 drop-shadow-md">
      <div className="flex items-center justify-between px-5 py-2 lg:justify-around">
        {/* Logo Section */}
        <a
          href="/en/"
          className="to-secondary-700 from-secondary divide-secondary-100 z-10 flex items-center justify-center gap-2 divide-x-2 divide-solid rounded-2xl bg-gradient-to-b px-5 py-2 text-secondary-foreground"
        >
          <div className="flex items-center justify-center gap-2">
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
                <span className="text-accent-200 text-xs">ENGINEER</span>
              </div>
            </div>
          </div>
          <span className="max-w-32 hidden pl-3 text-xs sm:inline">
            Heat loss reports for engineers
          </span>
        </a>

        {/* Navigation Links - Desktop */}
        <div className="hidden items-center justify-center gap-3 lg:flex">
          <nav className="relative z-10 hidden max-w-max flex-1 items-center justify-center lg:block">
            <div className="relative">
              <ul className="group flex flex-1 list-none items-center justify-center gap-4 space-x-1">
                {["Dashboard", "Portfolio", "Trade History", "Contact"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="py-2 text-sm transition-colors hover:text-accent-foreground"
                    >
                      {item}
                    </a>
                  )
                )}

                <button className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-4 py-2">
                  Account
                </button>

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
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
            <div className="rounded-lg border border-input bg-primary p-3 hover:bg-primary/80">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
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
          <div className="absolute left-0 top-full w-full bg-background/80 p-4 backdrop-blur-sm lg:hidden">
            <nav className="flex flex-col space-y-4">
              {["Dashboard", "Portfolio", "Trade History", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm transition-colors hover:text-accent-foreground"
                  >
                    {item}
                  </a>
                )
              )}

              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2">
                Account
              </button>

              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
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
