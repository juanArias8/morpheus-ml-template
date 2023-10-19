"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiResponse, User } from "@/lib/models";
import { LoginFormModel } from "@/components/organisms/auth/LoginForm/LoginForm";
import {
  loginWithEmailAndPasswordFirebase,
  sendUserPasswordResetEmail,
  signOutFirebase,
} from "@/api/auth-api";
import { useLocalStorage } from "usehooks-ts";
import { getUserInfo } from "@/api/users-api";

export enum AuthOption {
  Login = "login",
  Reset = "reset",
}

export interface IAuthContext {
  authLoading: boolean;
  authOption: AuthOption;
  setAuthOption: (authOption: AuthOption) => void;
  user: User;
  loadUserData: (authOption: AuthOption) => void;
  loginWithEmailAndPassword: (user: LoginFormModel) => Promise<any>;
  logout: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const defaultState = {
  authLoading: false,
  authOption: AuthOption.Login,
  setAuthOption: () => {},
  user: {} as User,
  loadUserData: async () => {},
  loginWithEmailAndPassword: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
};

const AuthContext = createContext<IAuthContext>(defaultState);

const AuthProvider = (props: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authOption, setAuthOption] = useState<AuthOption>(AuthOption.Login);
  const [user, setUser] = useState<any>({});
  const [localUser, setLocalUser] = useLocalStorage("user", {} as User);

  useEffect(() => {
    if (localUser && localUser.email) {
      loadUserData(localUser.email)
        .then(() => {
          setTimeout(() => {
            setAuthLoading(false);
          }, 500);
        })
        .catch(() => {
          setAuthLoading(false);
        });
    } else {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.email) {
      setLocalUser(user);
    }
  }, [user]);

  const loginWithEmailAndPassword = (user: LoginFormModel): Promise<any> => {
    return new Promise((resolve, reject) => {
      loginWithEmailAndPasswordFirebase(user)
        .then((response: any) => {
          loadUserData(response.email);
          resolve(response);
        })
        .catch((error: any) => {
          alert(error.message);
          reject(error);
        });
    });
  };

  const loadUserData = async (email: string) => {
    try {
      const response: ApiResponse = await getUserInfo(email);
      if (response.success) {
        setUser(response.data);
        setLocalUser(response.data);
        if (pathname === "/") {
          router.push("/");
        }
      } else {
        alert(`The user ${email} is not an user`);
      }
    } catch (error: any) {
      alert(error.message || "An error occurred while loading the user data");
    }
  };

  const logout = async (): Promise<any> => {
    try {
      await signOutFirebase();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/");
      setUser({} as User);
      setLocalUser({} as User);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  const resetPassword = async (email: string): Promise<any> => {
    try {
      await sendUserPasswordResetEmail(email);
      alert("Email sent successfully");
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        authOption,
        setAuthOption,
        user,
        loadUserData,
        loginWithEmailAndPassword,
        logout,
        resetPassword,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
