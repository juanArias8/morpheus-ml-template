"use client";

import { useAuth } from "@/components/organisms/Auth/AuthContext";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { UserForm } from "@/components/organisms/User/UserForm";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <section className="main-section">
      <Typography variant={TypographyVariant.Title}>Profile</Typography>
      <Typography variant={TypographyVariant.Paragraph}>
        Welcome {user.email}
      </Typography>

      <div className="mt-20">
        <Typography variant={TypographyVariant.Subtitle} className="mb-5">
          Update your profile info
        </Typography>

        <UserForm />
      </div>
    </section>
  );
}
