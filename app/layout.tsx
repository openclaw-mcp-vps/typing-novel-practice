import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://typing-novel-practice.com"),
  title: "Typing Novel Practice | Learn typing by retyping classic novels",
  description:
    "Build speed and accuracy by typing your way through classic novels. Chapter-by-chapter practice with real-time WPM, accuracy tracking, and progress analytics.",
  openGraph: {
    title: "Typing Novel Practice",
    description: "Retype classic literature to improve typing speed and accuracy with real-time feedback.",
    url: "https://typing-novel-practice.com",
    siteName: "Typing Novel Practice",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Typing Novel Practice",
    description: "Learn typing by retyping classic novels chapter by chapter."
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#161b22",
              color: "#e6edf3",
              border: "1px solid #30363d"
            }
          }}
        />
      </body>
    </html>
  );
}
