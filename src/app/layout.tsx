import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import StoreProvider from "@/lib/storeProvider";

import { Toaster } from "react-hot-toast";

import { Toaster as Toast2 } from "@/components/ui/toaster";
import CustomeLayout from "./customLayout";

const robotoSlab = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: any = {
  title: {
    default: "Shreya Collection",
    template: "%s | Shreya Collection",
  },
  keywords:
    "Shreya Collection, nightwear, nighty, loungewear, sleepwear, women's nightwear, men's nightwear, comfortable sleepwear, stylish nighty, cotton nightwear, satin nighty, pajama sets, nightdresses, luxury nightwear, soft fabric nightwear, affordable nightwear, cozy nightwear, plus-size nightwear, bridal nightwear, maternity nightwear, sleepwear for women, sleepwear for men, online nightwear store, buy nighties online, trendy nightwear, nightwear for all seasons, nightwear collection, sleep comfort, Shreya Collection fashion, best online nightwear store, shop nightwear online, bedtime essentials",

  description:
    "Shreya Collection specializes in high-quality nightwear and nighties for women and men. Discover comfortable, stylish sleepwear and loungewear, including cotton nighties, satin sleepwear, and more. Shop online for a cozy and restful night's sleep.",

  image: "/assets/logo/logo.png",
  url: "https://www.shreyacollection.in/",

  author: "Shreya Collection Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/SAMAN___.TTF"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="./favicon.ico" sizes="any" />
      </head>
      <body className={` ${robotoSlab.variable} font-sans`}>
        <StoreProvider>
          <Toaster />
          <Toast2 />

          <CustomeLayout>{children}</CustomeLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
