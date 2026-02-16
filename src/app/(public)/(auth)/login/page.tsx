"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition duration-200 shadow-sm"
        >
          <Image src={"/google.png"} width={20} height={20} alt="google" ></Image>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
