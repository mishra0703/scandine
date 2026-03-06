"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreVerticalSquare01Icon,
  MenuRestaurantIcon,
  CafeIcon,
  NoodlesIcon,
  CheckListIcon,
  LiveStreaming01Icon,
  Logout02Icon,
  UserSettings02Icon,
  NoteDoneIcon,
} from "@hugeicons/core-free-icons";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DashboardSquare03Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons/index";
import { useSettings } from "@/context/SettingsContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const moreOptionsRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target)
      ) {
        setMoreOptions(false);
      }
    };

    if (moreOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreOptions]);

  return (
    <div className="w-full h-[8vh] bg-[var(--nav-bg)] flex flex-col relative">
      <div className="h-[8vh] flex justify-between items-center px-5">
        <span className="max-sm:text-2xl text-3xl sm:px-5 font-bold numans text-[var(--nav-text)]">
          {settings?.cafeName || "ScanDine"}
        </span>
        <ul className="max-lg:hidden px-5 flex gap-10 justify-around poppins text-lg font-light">
          <li className="text-white border-2 border-transparent hover:border-white rounded-full px-4 py-1.5 transition-all duration-400 ease-in-out cursor-pointer">
            {session ? (
              <Link href="/menu" className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={MenuRestaurantIcon}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                Menu
              </Link>
            ) : (
              <Link href="/" className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={CafeIcon}
                  size={22}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                Home
              </Link>
            )}
          </li>
          <li className="text-white border-2 border-transparent hover:border-white rounded-full px-4 py-1.5 transition-all duration-400 ease-in-out cursor-pointer">
            {session ? (
              <Link href="/live-orders" className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={LiveStreaming01Icon}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                Orders
              </Link>
            ) : (
              <Link href="/order" className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={NoodlesIcon}
                  size={22}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                Order
              </Link>
            )}
          </li>
          <li className="text-white border-2 border-transparent hover:border-white rounded-full px-4 py-1.5 transition-all duration-400 ease-in-out cursor-pointer">
            {session ? (
              <Link href="/inventory" className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CheckListIcon}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                Inventory
              </Link>
            ) : (
              <Link href="/my-orders" className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={NoteDoneIcon}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                My Orders
              </Link>
            )}
          </li>
          <li
            ref={moreOptionsRef}
            className={
              session
                ? `text-white border-2 border-transparent hover:border-white rounded-full px-4 py-1.5 transition-all duration-400 ease-in-out cursor-pointer`
                : "hidden"
            }
          >
            {session && (
              <span
                className="flex items-center gap-1"
                onClick={() => setMoreOptions(!moreOptions)}
              >
                <HugeiconsIcon
                  icon={Menu01Icon}
                  color="#ffffff"
                  strokeWidth={1.5}
                />
                More
              </span>
            )}
            {moreOptions && (
              <ul className="absolute top-[8vh] right-3 w-1/10 bg-[var(--nav-bg)] flex flex-col items-center gap-5 py-5 z-50 poppins text-lg font-light border-t border-white/20 rounded-b-3xl animate-slide-down">
                <li className="text-white cursor-pointer border-2 border-transparent hover:border-white p-2 rounded-full">
                  <Link
                    href="/dashboard"
                    onClick={() => setMoreOptions(false)}
                    className="flex items-center gap-1"
                  >
                    <HugeiconsIcon
                      icon={DashboardSquare03Icon}
                      size={22}
                      color="#ffffff"
                      strokeWidth={1.5}
                    />
                    Dashboard
                  </Link>
                </li>
                <li className="text-white cursor-pointer border-2 border-transparent hover:border-white p-2 rounded-full">
                  <Link
                    href="/profile"
                    onClick={() => setMoreOptions(false)}
                    className="flex items-center gap-1"
                  >
                    <HugeiconsIcon
                      icon={UserSettings02Icon}
                      size={22}
                      color="#ffffff"
                      strokeWidth={1.5}
                    />
                    Profile
                  </Link>
                </li>
                <li className="text-white cursor-pointer border-2 border-transparent hover:border-white p-2 rounded-full">
                  <Link
                    href="/"
                    className="flex items-center gap-1"
                    onClick={async () => {
                      setMoreOptions(false);
                      router.push("/");
                      await signOut({ redirect: false });
                    }}
                  >
                    <HugeiconsIcon
                      icon={Logout02Icon}
                      size={22}
                      color="#ffffff"
                      strokeWidth={1.5}
                    />
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        <HugeiconsIcon
          className="md:hidden"
          icon={MoreVerticalSquare01Icon}
          color="#ffffff"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>
      {menuOpen && (
        <ul className="absolute top-[8vh] left-0 w-full bg-[var(--nav-bg)] flex flex-col items-center gap-5 py-5 z-50 poppins text-lg font-light border-t border-white/20 animate-slide-down">
          {session ? (
            <>
              <li className="text-white cursor-pointer">
                <Link
                  href="/menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon
                    icon={MenuRestaurantIcon}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Menu
                </Link>
              </li>
              <li className="text-white cursor-pointer">
                <Link
                  href="/inventory"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <HugeiconsIcon
                    icon={CheckListIcon}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Inventory
                </Link>
              </li>
              <li className="text-white cursor-pointer">
                <Link
                  href="/live-orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <HugeiconsIcon
                    icon={LiveStreaming01Icon}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Orders
                </Link>
              </li>
              <li className="text-white cursor-pointer">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon
                    icon={DashboardSquare03Icon}
                    size={22}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Dashboard
                </Link>
              </li>
              <li className="text-white cursor-pointer">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon
                    icon={UserSettings02Icon}
                    size={22}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Profile
                </Link>
              </li>
              <li className="text-white cursor-pointer">
                <Link
                  href="/"
                  className="flex items-center gap-1"
                  onClick={async () => {
                    setMenuOpen(false);
                    router.push("/");
                    await signOut({ redirect: false });
                  }}
                >
                  <HugeiconsIcon
                    icon={Logout02Icon}
                    size={22}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="text-white cursor-pointer">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon
                    icon={CafeIcon}
                    size={22}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Home
                </Link>
              </li>
              <li className="text-white cursor-pointer">
                <Link
                  href="/order"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon
                    icon={NoodlesIcon}
                    size={22}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  Order
                </Link>
              </li>
              <li className="text-white cursor-pointer">
                <Link
                  href="/my-orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon
                    icon={NoteDoneIcon}
                    size={22}
                    color="#ffffff"
                    strokeWidth={1.5}
                  />
                  My Orders
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default Navbar;
