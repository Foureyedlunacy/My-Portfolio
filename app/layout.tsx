import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel"; // Or GeistPixelGrid, GeistPixelCircle, etc.
import "./globals.css";
import Nav from "@/components/Nav";



export const metadata: Metadata = {
  title: "Gyanshu Kushwaha Portfolio",
  description: "An multi aspect digital artist ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}  >
      <body className="min-h-full flex flex-col"> <Nav/>
        {children}
        </body>
    </html>
  );
}
