import Image from "next/image";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { useAuth } from "@/components/organisms/Auth/AuthContext";

interface UserPromptProps {
  prompt: string;
  className?: string;
}

const UserPrompt = (props: UserPromptProps) => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div
      className={`flex w-full flex-row px-6 items-center ${props.className}`}
    >
      <div className="avatar">
        <div className="h-8 w-8 rounded-full">
          <Image
            src={user.avatar ?? "/images/avatar.png"}
            alt={user.email}
            width={40}
            height={40}
            className={"object-contain"}
          />
        </div>
      </div>

      <Typography variant={TypographyVariant.Paragraph} className={"ml-5"}>
        {props.prompt}
      </Typography>
    </div>
  );
};

export default UserPrompt;
