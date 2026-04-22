import type { Metadata } from "next";
import { IBM_Plex_Mono, Playfair_Display } from "next/font/google";

import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Typing Novel Practice",
    template: "%s | Typing Novel Practice",
  },
  description:
    "Learn typing by retyping classic novels. Improve WPM and accuracy with chapter-based practice designed for remote professionals.",
  keywords: [
    "typing practice",
    "typing speed",
    "wpm training",
    "literature typing",
    "remote work productivity",
  ],
  openGraph: {
    title: "Typing Novel Practice",
    description:
      "Retype classic novel passages, track WPM live, and unlock chapters as your accuracy improves.",
    type: "website",
    siteName: "Typing Novel Practice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typing Novel Practice",
    description:
      "Build speed and precision with a typing app made for people who type all day.",
  },
  metadataBase: new URL("https://typing-novel-practice.example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
