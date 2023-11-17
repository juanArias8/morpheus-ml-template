"use client";
import {Fragment, ReactNode, useEffect, useState} from "react";
import {useAuth} from "@/components/organisms/Auth/AuthContext";
import {usePathname, useRouter} from "next/navigation";
import CircleLoader from "@/components/atoms/CircleLoader";
import FullScreenLoader from "@/components/molecules/FullScreenLoader";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
    const {user} = useAuth();
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

    return user ? <Fragment>{props.children}</Fragment> : <FullScreenLoader isLoading={isLoading}/>;
}
