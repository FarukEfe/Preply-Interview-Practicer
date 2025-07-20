import type { Metadata } from "next";
import { Crimson_Pro } from "next/font/google";
import "./globals.css";

// Configure the font
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Interview Prep App",
  description: "Your personal AI-powered interview coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply the font variable directly to the <html> tag
    <html lang="en" className={crimsonPro.variable}>
      <body>{children}</body>
    </html>
  );
}
