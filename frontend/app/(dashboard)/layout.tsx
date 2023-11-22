"use client";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/components/organisms/Auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import FullScreenLoader from "@/components/molecules/FullScreenLoader";
import { ModelsProvider } from "@/app/(dashboard)/ModelsContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { user } = useAuth();
  const pathName = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsLoading(false);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  if (pathName === "/") {
    router.push("/diffusion");
  }

  return user ? (
    <Fragment>
      <ModelsProvider>{props.children}</ModelsProvider>
    </Fragment>
  ) : (
    <FullScreenLoader isLoading={isLoading} />
  );
}
