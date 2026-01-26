
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import Preloader from "@/components/ui/preloader"
import { PerformanceMetrics } from "@/components/dev/performance-metrics";
import "./globals.css";

export const metadata: Metadata = {
  title: "HelaTV+",
  description: "Best Streaming Platform in Sri Lanka",
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={GeistSans.className}>
        <Providers>
          <Preloader />
          <PerformanceMetrics />
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
