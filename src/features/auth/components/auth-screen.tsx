
"use client";
import { useState } from "react";
import { SignInFlow } from "../types";
import { SignUpCard } from "./sign-up-card";
import { SignInCard } from "./sign-in-card";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="relative z-10 w-full md:w-[480px]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-wide drop-shadow-lg">
            COMMCORE
          </h1>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
          {state === "signIn" ? (
            <SignInCard setState={setState} />
          ) : (
            <SignUpCard setState={setState} />
          )}
        </div>
      </div>
    </div>
  );
};
