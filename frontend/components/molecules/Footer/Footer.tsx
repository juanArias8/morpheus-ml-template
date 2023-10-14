"use client";
import React from "react";
import Image from "next/image";
import { GithubIcon } from "@/components/atoms/icons/github";
import { TwitterIcon } from "@/components/atoms/icons/twitter";
import { LinkedinIcon } from "@/components/atoms/icons/linkedin";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";

const Footer = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      <aside>
        <Image
          src={"/favicon/android-chrome-192x192.png"}
          alt={"Morpheus logo"}
          width={100}
          height={200}
          className={"object-fit rounded-full border-2 border-gray-600 p-2"}
        />

        <Typography
          variant={TypographyVariant.Paragraph}
          className={"mt-[12px]"}
        >
          Morpheus - Monadical SAS
        </Typography>

        <Typography variant={TypographyVariant.Paragraph}>
          We build software that outlasts us
        </Typography>

        <Typography variant={TypographyVariant.Paragraph}>
          Copyright © {new Date().getFullYear()} - All right reserved by
          Monadical SAS
        </Typography>
      </aside>

      <nav>
        <header className="footer-title">Social</header>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://github.com/Monadical-SAS/Morpheus"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon />
          </a>

          <a
            href="https://twitter.com/MonadicalHQ"
            target="_blank"
            rel="noreferrer"
          >
            <TwitterIcon />
          </a>

          <a
            href="https://www.linkedin.com/company/monadical"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedinIcon />
          </a>
        </div>

        <a
          className="base-1 main mt-[24px] underline"
          href="mailto:hello@monadical.com"
        >
          Contact us
        </a>
      </nav>

      <form>
        <header className="footer-title">Newsletter</header>
        <fieldset className="form-control w-80">
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="username@site.com"
              className="input input-bordered w-full pr-16"
            />
            <button className="btn btn-primary absolute right-0 top-0 rounded-l-none">
              Subscribe
            </button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
};

export default Footer;
