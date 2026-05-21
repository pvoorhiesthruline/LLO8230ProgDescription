import type { Metadata } from "next";
import { Inter_Tight, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Pluralistic Program Description · LLO 8230",
  description: "Program Evaluation Design Portfolio — Vanderbilt Peabody College",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${interTight.variable} ${sourceSerif4.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
