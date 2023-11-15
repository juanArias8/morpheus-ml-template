"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/organisms/Auth/AuthContext";
import Brand from "@/components/atoms/Brand";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const redirectToHome = async () => {
    router.push("/");
  };

  return (
    <div
      className={cn(
        "navbar border-primary h-[8vh] hover:navbar-gradient flex flex-row justify-between border-b " +
          "bg-gradient-to-b from-primary/5 from-90% to-primary/30",
      )}
    >
      <div className="navbar-start">
        <a className="btn text-xl normal-case">
          <Brand
            short={false}
            onClick={redirectToHome}
            styles={{ fontSize: "22px" }}
          />
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link className="hover:text-accent mx-1" href={"/diffusion"}>
              Image Generation
            </Link>
          </li>
          <li>
            <Link className="hover:text-accent mx-1" href={"/chatbot"}>
              Text Generation
            </Link>
          </li>
          <li>
            <Link className="hover:text-accent mx-1" href={"/storytelling"}>
              Story Telling
            </Link>
          </li>
        </ul>
      </div>

      {user && (
        <div className="navbar-end pr-1">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar hover:border-1 hover:border-primary"
            >
              <div className="ring-primary ring-offset-base-100 shadow-primary rounded-full ring-[2px] ring-offset-1">
                <Image
                  src={user.avatar ?? "/images/morpheus.png"}
                  alt={"Morpheus logo"}
                  width={100}
                  height={100}
                  className={"rounded-full object-contain"}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2"
            >
              <li>
                <Link href={"/profile"} className="p-3">
                  Profile
                </Link>
              </li>

              <li>
                <a onClick={logout} className="p-3">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
