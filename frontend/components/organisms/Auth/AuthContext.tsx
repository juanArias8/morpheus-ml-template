"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { APIResponse, User } from "@/lib/models";
import {
  loginWithEmailAndPasswordFirebase,
  loginWithGoogleFirebase,
  sendUserPasswordResetEmail,
  signOutFirebase,
  signUpWithEmailAndPasswordFirebase,
} from "@/api/auth-api";
import { useLocalStorage } from "usehooks-ts";
import { getUserInfo, loadOrCreateUserInfo } from "@/api/users-api";

export enum AuthOption {
  Login = "login",
  Register = "register",
  Reset = "reset",
}

export interface LoginFormModel {
  email: string;
  password: string;
}

interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

export interface IAuthContext {
  authLoading: boolean;
  authOption: AuthOption;
  setAuthOption: (authOption: AuthOption) => void;
  user: User | null;
  loadUserData: (authOption: AuthOption) => void;
  registerWithEmailAndPassword: (user: UserRegistration) => Promise<void>;
  loginWithEmailAndPassword: (user: LoginFormModel) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext({} as IAuthContext);
const AuthProvider = (props: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authOption, setAuthOption] = useState<AuthOption>(AuthOption.Login);
  const [user, setUser] = useState<User | null>(null);
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

  const registerWithEmailAndPassword = async (user: UserRegistration) => {
    try {
      const firebaseUser = await signUpWithEmailAndPasswordFirebase(user);
      if (firebaseUser.email) {
        const newUser = { ...firebaseUser, displayName: user.name };
        await loadOrCreateMorpheusUser(newUser);
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const loginWithEmailAndPassword = async (
    user: LoginFormModel,
  ): Promise<any> => {
    try {
      const firebaseUser = await loginWithEmailAndPasswordFirebase(user);
      if (firebaseUser.email) {
        await loadOrCreateMorpheusUser(firebaseUser);
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const firebaseUser = await loginWithGoogleFirebase();
      if (firebaseUser.email) {
        await loadOrCreateMorpheusUser(firebaseUser);
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const loadOrCreateMorpheusUser = async (user: any) => {
    const morpheusUser = {
      email: user.email,
      name: user.displayName,
    };
    try {
      const response = await loadOrCreateUserInfo(morpheusUser);
      if (response.success) {
        setUser(response.data);
        router.push("/diffusion");
      }
    } catch (error) {
      throw new Error(String(error));
    }
  };

  const loadUserData = async (email: string) => {
    try {
      const response: APIResponse = await getUserInfo(email);
      if (response.success) {
        setUser(response.data);
        setLocalUser(response.data);
        if (pathname === "/") {
          router.push("/diffusion");
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
      setUser(null);
      setLocalUser({} as User);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  const resetPassword = async (email: string): Promise<any> => {
    try {
      await sendUserPasswordResetEmail(email);
      alert("Check your email to reset your password");
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
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        loginWithGoogle,
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
