"use client";
import React from "react";
import Image from "next/image";
import { GithubIcon } from "@/components/atoms/icons/github";
import { TwitterIcon } from "@/components/atoms/icons/twitter";
import { LinkedinIcon } from "@/components/atoms/icons/linkedin";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import Link from "next/link";
import { NewsletterForm } from "@/components/organisms/Newsletter/NewsletterForm";

interface FooterProps {
  showFooter?: boolean;
}

const Footer = (props: FooterProps) => {
  return (
    props.showFooter && (
      <footer className="footer bg-gradient-dark text-neutral-content p-10">
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

          <Link
            className="base-1 main mt-[24px] underline"
            href="/terms-of-service"
          >
            Terms of service
          </Link>

          <Link
            className="base-1 main mt-[24px] underline"
            href="/privacy-policy"
          >
            Privacy policy
          </Link>
        </nav>

        <NewsletterForm />
      </footer>
    )
  );
};

export default Footer;
