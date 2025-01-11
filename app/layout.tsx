"use client";

import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    fetch("/api/stock-price");
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
