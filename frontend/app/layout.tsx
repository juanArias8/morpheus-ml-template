import { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/organisms/auth/AuthContext";
import { AlertMessageProvider } from "@/components/organisms/AlertMessage/AlertMessageContext";
import Navbar from "@/components/organisms/Navbar/Navbar";
import Footer from "@/components/molecules/Footer/Footer";
import AlertMessage from "@/components/organisms/AlertMessage/AlertMessage";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morpheus ML template",
  description: "Template for Monadical ML projects",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
  return (
    <html lang="en" data-theme={"dark"}>
      <body className={"relative"}>
        <AlertMessageProvider>
          <AuthProvider>
            <Navbar />
            <main>{props.children}</main>
            <Footer />
            <AlertMessage />
          </AuthProvider>
        </AlertMessageProvider>
      </body>
    </html>
  );
}
