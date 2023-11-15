import { AuthOption, useAuth } from "@/components/organisms/Auth/AuthContext";
import { Button, ButtonVariant } from "@/components/atoms/Button";

const AuthSwitch = () => {
  const { authOption, setAuthOption } = useAuth();

  const getVariant = (option: AuthOption) => {
    return authOption === option
      ? ButtonVariant.Primary
      : ButtonVariant.Default;
  };

  return (
    <div className="flex flex-row bg-base-200 w-full py-2 px-2 rounded-xl my-5">
      <Button
        text="Sign In"
        variant={getVariant(AuthOption.Login)}
        onClick={() => setAuthOption(AuthOption.Login)}
        className="w-[50%]"
      />
      <Button
        text="Create Account"
        variant={getVariant(AuthOption.Register)}
        onClick={() => setAuthOption(AuthOption.Register)}
        className="w-[50%]"
      />
    </div>
  );
};

export default AuthSwitch;
