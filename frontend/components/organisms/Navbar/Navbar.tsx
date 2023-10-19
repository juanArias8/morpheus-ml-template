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
    <div className="navbar border-primary flex flex-row justify-between hover:border-b">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl normal-case">
          <Brand
            short={false}
            onClick={redirectToHome}
            styles={{ fontSize: "20px" }}
          />
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link className="hover:text-accent" href={"/diffusion"}>
              Image Generation
            </Link>
          </li>
          <li>
            <Link className="hover:text-accent" href={"/chatbot"}>
              Text Generation
            </Link>
          </li>
          <li>
            <Link className="hover:text-accent" href={"/storytelling"}>
              Story Telling
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar hover:border-1 hover:border-primary"
          >
            <div className="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2">
              <Image
                src={"/favicon/android-chrome-192x192.png"}
                alt={"Morpheus logo"}
                width={100}
                height={100}
                className={"rounded-full object-contain"}
              />
            </div>
          </div>
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
