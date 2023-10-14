"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/organisms/auth/AuthContext";
import Brand from "@/components/atoms/Brand/Brand";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const redirectToHome = async () => {
    router.push("/");
  };

  return (
    <div className="navbar bg-base-100 border-primary flex flex-row justify-between border-b-2">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl normal-case">
          <Brand onClick={redirectToHome} styles={{ fontSize: "20px" }} />
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/diffusion"}>Image Generation</Link>
          </li>
          <li>
            <Link href={"/chatbot"}>Text Generation</Link>
          </li>
          <li>
            <Link href={"/storytelling"}>Story Telling</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar hover:border-1 hover:border-primary p-1"
          >
            <div className="w-15 rounded-full">
              <Image
                src={"/favicon/android-chrome-192x192.png"}
                alt={"Morpheus logo"}
                width={200}
                height={200}
                className={"rounded-full object-contain"}
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Profile</a>
            </li>

            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
