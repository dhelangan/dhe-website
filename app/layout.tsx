import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Outfit } from "next/font/google";
import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";
import ThemeScript from "./_components/ThemeScript";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const outfitHeading = Outfit({subsets:['latin'],variable:'--font-heading'});

const montserrat = Montserrat({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dhelangan Studio",
    template: "%s | Dhelangan Studio",
  },
  description: "A game studio crafting tabletop and digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", montserrat.variable, outfitHeading.variable)}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full overflow-x-hidden">
        <SiteHeader />
        <TooltipProvider>
        <main className="mx-auto mt-20 pb-10 bg-background">{children}</main>
        </TooltipProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
