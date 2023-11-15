"use client";

import { Typography, TypographyVariant } from "@/components/atoms/Typography";

export default function TermsOfService() {
  return (
    <div className="p-24">
      <Typography variant={TypographyVariant.Title}>
        Terms of Service
      </Typography>
      <Typography variant={TypographyVariant.Paragraph}>
        Effective Date: [Insert Date]{" "}
      </Typography>
      ---
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          1. Introduction{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          Welcome to Morpheus, a product of Monadical Labs ("we", "our", or
          "us"). By using the services, products, and software provided through
          Morpheus, you agree to be bound by these Terms of Service ("Terms").
          Please read these Terms carefully before using Morpheus.
        </Typography>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          2. Acceptance of Terms{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          By accessing or using Morpheus, you signify your agreement to these
          Terms. If you do not agree to these Terms, you may not access or use
          Morpheus.
        </Typography>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          3. Changes to the Terms{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          Monadical Labs reserves the right to modify or replace these Terms at
          any time. If a revision is significant, we will provide at least 30
          days' notice prior to any new terms taking effect. Your continued use
          of Morpheus after the changes constitutes your acceptance of the new
          Terms.
        </Typography>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          4. User Accounts{" "}
        </Typography>
        <ul>
          <li>
            a. To access some features of Morpheus, you may need to register for
            an account. You must provide accurate and complete information
            during the registration process.
          </li>
          <li>
            b. You are responsible for safeguarding your password and any
            actions under your account.
          </li>
          <li>
            c. Monadical Labs reserves the right to suspend or terminate your
            account if any information provided is false or misleading.
          </li>
        </ul>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          5. Privacy Policy{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          Your use of Morpheus is also governed by our Privacy Policy, which can
          be found at [Insert Link to Privacy Policy].
        </Typography>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          6. Restrictions{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          You may not:
        </Typography>
        <ul>
          <li>
            a. Decompile, reverse engineer, or attempt to extract the source
            code of Morpheus.
          </li>
          <li>b. Use Morpheus for any illegal or unauthorized purpose.</li>
          <li>c. Violate any laws in your jurisdiction.</li>
        </ul>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          7. Termination{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          We may terminate or suspend access to Morpheus immediately, without
          prior notice, for any reason, including breach of these Terms.
        </Typography>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          8. Limitation of Liability{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          In no event shall Monadical Labs be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss
          of profits or revenues, whether incurred directly or indirectly.
        </Typography>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          9. Governing Law{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          These Terms shall be governed by the laws of [Insert Jurisdiction],
          without regard to its conflict of law provisions.
        </Typography>
      </div>
      <div className={"mt-10"}>
        <Typography variant={TypographyVariant.Subtitle}>
          10. Contact Information{" "}
        </Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          For any questions about these Terms, please contact us at [Insert
          Contact Email/Address].
        </Typography>
      </div>
      <Typography variant={TypographyVariant.Span}>
        © [{new Date().getFullYear()}] Monadical Labs. All rights reserved.
      </Typography>
    </div>
  );
}
