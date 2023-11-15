"use client";
import { Fragment, ReactNode } from "react";
import { useAuth } from "@/components/organisms/Auth/AuthContext";
import { Auth } from "@/components/organisms/Auth/Auth";
import { usePathname, useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { user } = useAuth();
  const pathName = usePathname();
  const router = useRouter();

  if (pathName === "/") {
    router.push("/diffusion");
  }

  return user ? <Fragment>{props.children}</Fragment> : <Auth />;
}
