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
    default: "FreshGo",
    template: "%s | FreshGo",
  },
  keywords:
    "FreshGo, grocery delivery, fresh fruits, vegetables, dairy, bakery, meat, seafood, organic food, online grocery, supermarket delivery, grocery store, quick delivery, food delivery, fresh produce, household essentials, pantry items, healthy food, local grocery, affordable groceries, grocery shopping, home delivery, contactless delivery, quality groceries, fresh food, farm to table, grocery app, online supermarket, grocery service, daily essentials",

  description:
    "FreshGo specializes in delivering fresh, high-quality groceries straight to your doorstep. Discover a wide range of fruits, vegetables, dairy, bakery items, and more with convenient same-day delivery. Shop online for all your grocery needs with the freshness you can trust.",

  image: "/assets/images/logo.png",
  url: "https://www.freshgo.in/",

  author: "FreshGo Team",
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
