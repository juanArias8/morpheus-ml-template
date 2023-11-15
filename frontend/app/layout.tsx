"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/components/organisms/Auth/AuthContext";
import { AlertMessageProvider } from "@/components/organisms/AlertMessage/AlertMessageContext";
import Navbar from "@/components/organisms/Navbar/Navbar";
import Footer from "@/components/molecules/Footer";
import AlertMessage from "@/components/organisms/AlertMessage/AlertMessage";
import { usePathname } from "next/navigation";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

const pagesWithFooter = [
  "/",
  "/about",
  "/profile",
  "/terms-of-service",
  "/privacy-policy",
];

export default function RootLayout(props: RootLayoutProps) {
  const pathName = usePathname();
  const showFooter = pagesWithFooter.includes(pathName);

  return (
    <html lang="en" data-theme={"dark"}>
      <body className={"relative"}>
        <AlertMessageProvider>
          <AuthProvider>
            <Navbar />
            <main>{props.children}</main>
            <Footer showFooter={showFooter} />
            <AlertMessage />
          </AuthProvider>
        </AlertMessageProvider>
      </body>
    </html>
  );
}
