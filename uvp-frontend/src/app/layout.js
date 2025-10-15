import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NameProvider } from "@/context/NameContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UVP - Unified Volunteer Platform",
  description: "A platform to connect volunteers with local organizations and projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <NameProvider >
            {children}
          </NameProvider>
      </body>
    </html>
  );
}
