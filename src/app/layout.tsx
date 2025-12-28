import type { Metadata } from "next";
import { Inter, Nunito, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/common/ProgressBarProvider";
import { ThemeProvider } from "next-themes";
import { AITrialsProvider } from "@/lib/context/AITrialsContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OatMeal - Professional AI Resume Builder",
  description:
    "Generate a polished, professional resume in just a few clicks with our AI-powered resume builder.",
  icons: {
    icon: "/icons/cat-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          logoImageUrl: "/icons/cat-removebg-preview.png",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${nunito.variable} ${poppins.variable} font-inter`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AITrialsProvider>
              <Providers>{children}</Providers>
            </AITrialsProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
