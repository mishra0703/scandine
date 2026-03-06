"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BestSeller from "@/components/BestSeller";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NaturalFoodIcon,
  Pizza01Icon,
  RiceBowl01Icon,
  Call02Icon,
  InstagramIcon,
  WhatsappIcon,
  StoreLocation02Icon,
} from "@hugeicons/core-free-icons";
import { useSettings } from "@/context/SettingsContext";

export default function Home() {
  const { settings } = useSettings();

  return (
    <>
      <section className="relative overflow-x-hidden">
        <div className="relative z-1 h-screen image-container">
          <img
            src="https://res.cloudinary.com/dowddfjrm/image/upload/v1772098409/ChatGPT_Image_Feb_26_2026_03_02_55_PM_1_mljhxp.png"
            alt="Protein bowl"
            className="absolute -left-35 max-sm:top-0 top-5 md:w-[40rem] "
          />
          <img
            src="https://res.cloudinary.com/dowddfjrm/image/upload/v1772098729/ChatGPT_Image_Feb_26_2026_03_08_04_PM_rrbfvt.png"
            alt="Healthy salad"
            className="absolute z-30 -right-20 max-sm:bottom-5 -bottom-10 md:w-[38rem] "
          />
        </div>

        <div className="absolute z-10 top-0 left-0 right-0 max-w-3xl mx-auto text-center px-6 h-screen flex flex-col justify-center items-center max-sm:pb-15">
          <h1 className="montserrat text-4xl md:text-6xl font-black text-[#4b2e2b] leading-tight">
            Where Comfort <br /> Meets Cravings
          </h1>

          <p className="poppins font-medium mt-6 text-base max-sm:text-sm text-[#6b4c45]">
            Gym-focused, protein-rich meals made fresh for fitness enthusiasts.
          </p>

          <Link href="/order">
            <button className="numans mt-8 px-8 py-3 bg-[#6b3f35] text-white cursor-pointer rounded-xl hover:bg-[#5a332b] transition">
              Order Now
            </button>
          </Link>
        </div>
        <div className="best-sellers relative z-20 w-full flex flex-col items-center gap-8 my-10">
          <div className="title-sec flex flex-col items-center gap-3 px-2">
            <span className="raleway text-5xl max-sm:text-4xl font-black text-[#4b2e2b]">
              Best Seller
            </span>
            <span className="poppins text-lg max-sm:text-base text-[#4b2e2b]">
              Fuel your workout with our top-to picks
            </span>
          </div>

          <div className="Gallery-Section max-sm:px-3 ">
            <BestSeller />
          </div>
        </div>

        <div className="about-us flex w-full max-sm:flex-col max-sm:gap-15 max-sm:px-2 my-25">
          <div className="writing-part w-1/2 max-sm:w-full flex flex-col gap-3 sm:pl-15 max-sm:px-4">
            <div className="flex gap-6 max-sm:gap-3">
              <span className="text-[var(--heading)]/80 text-5xl max-sm:text-2xl font-semibold poppins">
                Know About
              </span>
              <span className="text-[var(--dark-heading)] text-5xl max-sm:text-2xl font-bold poppins">
                {settings?.cafeName || "ScanDine"}
              </span>
            </div>
            <span className="text-[var(--light-heading)] text-2xl max-sm:text-lg montserrat font-semibold">
              Healthy Meals , Big Gains
            </span>
            <span className="w-3/4 max-sm:w-full max-sm:text-sm py-3 text-[var(--heading)] text-base montserrat font-medium">
              At GWM cafe, we serve more than just food; we serve a lifestyle.
              Our menu is crafted to fuel your fitness journey with delicious,
              protein-packed meals that nourish your body and satisfy your
              cravings.
            </span>
            <ul className="text-[var(--text)] flex flex-col gap-5 max-sm:gap-3 montserrat text-xl max-sm:text-base font-semibold mt-3">
              <li className="flex items-center gap-2.5">
                <HugeiconsIcon
                  icon={RiceBowl01Icon}
                  size={30}
                  fill="brownnpm "
                />
                High-Protein Meals
              </li>
              <li className="flex items-center gap-2.5">
                <HugeiconsIcon icon={NaturalFoodIcon} size={30} fill="green" />
                Nutritious & Fresh Ingredients
              </li>
              <li className="flex items-center gap-2.5">
                <HugeiconsIcon icon={Pizza01Icon} size={30} fill="yellow" />
                Ditch the Junk Food
              </li>
            </ul>
          </div>
          <div className="relative w-full max-sm:px-2 sm:w-1/2 flex justify-center sm:items-end max-sm:justify-end">
            <img
              src="/cafe (2).jpg"
              alt="GWM Cafe interior"
              className="w-[85%] max-sm:w-9/10 max-sm:h-60 h-96 object-cover rounded-2xl shadow-xl opacity-90 max-sm:opacity-75 max-sm:border-3"
            />
            <img
              src="/cafe (1).jfif"
              alt="GWM Cafe ambiance"
              className="absolute -left-4 max-sm:left-2 bottom-0 w-[45%] h-80 max-sm:h-40 object-cover rounded-t-full shadow-lg"
            />
            <span className="absolute -bottom-15 w-max mx-auto text-xl max-sm:text-base font-medium italic text-[var(--light-heading)] poppins">
              " Because your body deserves the best ! "
            </span>
          </div>
        </div>
        <div
          className="last-banner bg-[var(--btn-color)] py-5 rounded-4xl shadow-lg flex flex-col justify-center items-center gap-3 w-3/4 max-sm:w-9/10 mx-auto max-sm:px-2 my-15 relative"
          style={{
            backgroundImage: "url('/banner-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-4xl"></div>
          <span className="poppins text-4xl max-sm:text-xl font-bold text-white relative z-10 drop-shadow-[0_4px_8px_rgba(255,255,255,0.3)]">
            Connect with us
          </span>
          <div className="links flex gap-10 max-sm:gap-5 justify-center items-center relative z-10">
            <Link
              href={`tel:${settings?.contactNumber}`}
              target="_blank"
              className="text-white flex gap-1.5 items-center max-sm:text-xs text-lg numans"
            >
              <HugeiconsIcon
                className=" max-sm:w-7 max-sm:h-7"
                icon={Call02Icon}
              />
              <span className="hidden sm:inline">Call us</span>
            </Link>
            <Link
              href={`https://${settings?.instagramLink}`}
              target="_blank"
              className="text-white flex gap-1.5 items-center max-sm:text-xs text-lg numans"
            >
              <HugeiconsIcon
                className=" max-sm:w-7 max-sm:h-7"
                icon={InstagramIcon}
              />
              <span className="hidden sm:inline">Follow on Instagram</span>
            </Link>
            <Link
              href={`https://wa.me/${settings?.whatsappNumber}`}
              target="_blank"
              className="text-white flex gap-1.5 items-center max-sm:text-xs text-lg numans"
            >
              <HugeiconsIcon
                className=" max-sm:w-7 max-sm:h-7"
                icon={WhatsappIcon}
              />
              <span className="hidden sm:inline">Whatsapp Now</span>
            </Link>
          </div>
          <div className="address flex gap-1.5 max-sm:gap-2 items-center text-base max-sm:text-xs text-white montserrat font-semibold relative z-10">
            <HugeiconsIcon icon={StoreLocation02Icon} />
            <span>{settings?.address}</span>
          </div>
        </div>
      </section>
    </>
  );
}
