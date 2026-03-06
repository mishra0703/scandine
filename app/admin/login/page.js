"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CafeIcon } from "@hugeicons/core-free-icons";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const { data: session } = useSession();

  useEffect(() => {
    document.title = "Login | ScanDine";
    if (session) {
      router.push(`/dashboard`);
    }
  }, [session, router]);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div>
        <section className="poppins">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto mt-20 lg:py-0">
            <div className="w-full backdrop-blur-md rounded-4xl bg-[var(--bg)] shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0  dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="flex items-center justify-center gap-2 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                  <HugeiconsIcon icon={CafeIcon} size={24} strokeWidth={1.75} />
                  Admin
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={loginUser}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Your email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={data.email}
                      onChange={(e) => {
                        setData({ ...data, email: e.target.value });
                      }}
                      className="focus-visible:outline-none focus-visible:border-neutral-800 transition-all duration 300 ease-in-out border-2 border-neutral-400 text-gray-900 text-sm rounded-lg w-full p-2.5 "
                      placeholder="xyz@email.com"
                      required=""
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={data.password}
                      onChange={(e) => {
                        setData({ ...data, password: e.target.value });
                      }}
                      placeholder="••••••••"
                      className="focus-visible:outline-none focus-visible:border-neutral-800 transition-all duration 300 ease-in-out border-2 border-neutral-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                      required=""
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--btn-color)] hover:bg-[var(--btn-hover-color)] transition-all duration-300 ease-in-out rounded-lg text-xl text-white font-semibold px-5 py-2.5 text-center cursor-pointer montserrat tracking-wider"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Page;
