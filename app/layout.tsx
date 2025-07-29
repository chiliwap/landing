import type { Metadata } from "next";
import { Inter, Special_Gothic_Expanded_One } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const specialGothicExpandedOne = Special_Gothic_Expanded_One({
  variable: "--font-special_gothic_expanded_one",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["sans-serif"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chiliwap",
  description: "Imagine a home that protects itself.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${specialGothicExpandedOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
