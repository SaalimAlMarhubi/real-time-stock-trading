"use client";

import { useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize the producer
    fetch("/api/stock-price");

    // Cleanup when component unmounts
    return () => {
      fetch("/api/stock-price", { method: "DELETE" });
    };
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
