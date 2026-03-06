"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  UserAccountIcon,
  Camera01Icon,
  Mail01Icon,
  StarIcon,
  Call02Icon,
  WhatsappIcon,
  Location10Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";
import { useSession } from "next-auth/react";

const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cafename: "",
    password: "",
    profilepic: "",
    contactNumber: "",
    whatsappNumber: "",
    address: "",
    instagramLink: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const [adminRes, settingsRes] = await Promise.all([
        fetch("/api/admin/me"),
        fetch("/api/settings"),
      ]);

      const adminData = await adminRes.json();
      const settingsData = await settingsRes.json();

      setFormData({
        name: adminData.name || "",
        email: adminData.email || "",
        cafename: adminData.cafename || "",
        password: "",
        profilepic: adminData.profilepic || "",
        contactNumber: settingsData.contactNumber || "",
        whatsappNumber: settingsData.whatsappNumber || "",
        address: settingsData.address || "",
        instagramLink: settingsData.instagramLink || "",
      });
    };

    if (session) loadData();
  }, [session]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        },
      );

      const uploadResult = await res.json();

      if (!res.ok) {
        throw new Error(uploadResult.error?.message || "Upload failed");
      }

      const imageUrl = uploadResult.secure_url;

      setFormData((prev) => ({ ...prev, profilepic: imageUrl }));

      setImagePreview(imageUrl);
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/admin/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      const settingsRes = await updateSettings();

      if (!settingsRes) {
        toast.error("Something went wrong !");
        return;
      }

      toast.success("Profile updated successfully");
      window.location.reload();
    }
  };

  const updateSettings = async () => {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cafeName: formData.cafename,
        contactNumber: formData.contactNumber,
        whatsappNumber: formData.whatsappNumber,
        address: formData.address,
        instagramLink: formData.instagramLink,
      }),
    });

    return await res.json();
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="p-5 flex w-full flex-col gap-8">
        <div className="title-bar flex flex-col items-center justify-center">
          <div className="title-sec flex gap-2 items-center text-4xl max-sm:text-3xl poppins font-bold text-[var(--dark-heading)]">
            <HugeiconsIcon icon={UserAccountIcon} size={40} />
            <h1 className="poppins text-3xl font-bold">Profile</h1>
          </div>
          <span className="sub-tittle text-base max-sm:text-sm max-sm:font-semibold dm-sans font-medium text-[var(--light-heading)]">
            Admin Account
          </span>
        </div>
        <div className="w-8/10 max-sm:w-full h-max mx-auto  rounded-2xl sm:shadow-md">
          <div className="flex max-sm:w-full max-sm:flex-col max-sm:gap-5">
            <div className="w-3/10 max-sm:w-full sm:border-r-2 max-sm:rounded-2xl sm:rounded-l-2xl border-neutral-400 bg-[#fff8f7] flex flex-col p-5 max-sm:shadow-md ">
              <span className="poppins font-medium text-2xl text-[var(--text)] my-2">
                Profile Overview
              </span>
              <div className="img-part w-full flex flex-col gap-1 items-center justify-start py-3 max-sm:py-2 max-sm:w-full">
                <div className="img w-40 h-40 overflow-hidden max-sm:w-30 max-sm:h-30 rounded-full">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={formData.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <>
                      <img
                        src={formData.profilepic || "/default_food.jfif"}
                        alt={formData.name}
                        className="object-cover w-full h-full"
                      />
                    </>
                  )}
                </div>
                <span className="text-sm max-sm:text-xs poppins text-[var(--text)] font-semibold mt-1">
                  Click to update new Image
                </span>
                <span className="text-xs max-sm:text-[10px] poppins text-[var(--text)]">
                  (Recommended: 1:1 ratio , JPG/PNG)
                </span>
              </div>
              <button
                className="mt-5 w-max mx-auto border-2 border-amber-900/75 bg-[#f7efeb] text-[var(--dark-heading)] py-1 px-1 rounded-lg hover:bg-[#f5edea] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <HugeiconsIcon icon={Camera01Icon} size={22} /> Change Photo
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </button>
              <div className="admin-name flex flex-col gap-2 my-5">
                <label
                  htmlFor="admin-name"
                  className="text-lg poppins font-medium text-[var(--text)]"
                >
                  Name
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  type="text"
                  className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                  placeholder="Enter name"
                />
              </div>
            </div>
            <div className="w-7/10 max-sm:w-full flex flex-col bg-white max-sm:rounded-2xl sm:rounded-r-2xl p-5  max-sm:shadow-md sm:pl-10">
              <span className="poppins font-medium text-2xl text-[var(--text)] my-2">
                Personal Info
              </span>
              <div className="w-full flex max-sm:flex-col gap-2">
                <div className="flex flex-col sm:w-1/2">
                  <div className="w-full admin-email flex flex-col gap-2 my-3">
                    <label
                      htmlFor="admin-email"
                      className="text-lg poppins font-medium text-[var(--text)]"
                    >
                      Email
                    </label>
                    <span className="relative sm:w-8/10">
                      <input
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        type="text"
                        className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 pr-10 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="Enter new email"
                      />
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--icon-color)] cursor-pointer bg-white"
                        size={25}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                  <div className="w-full admin-password flex flex-col gap-2 my-3">
                    <label
                      htmlFor="admin-password"
                      className="text-lg poppins font-medium text-[var(--text)]"
                    >
                      Password
                    </label>
                    <span className="relative sm:w-8/10">
                      <input
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        type={showPassword ? "text" : "password"}
                        className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 pr-10 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="Enter new password"
                      />
                      <HugeiconsIcon
                        icon={showPassword ? ViewIcon : ViewOffIcon}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--icon-color)] cursor-pointer bg-white"
                        size={25}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                  <div className="w-full cafe-name flex flex-col gap-2 my-3">
                    <label
                      htmlFor="cafe-name"
                      className="text-lg poppins font-medium text-[var(--text)]"
                    >
                      Cafe` Name
                    </label>
                    <input
                      value={formData.cafename}
                      onChange={(e) =>
                        setFormData({ ...formData, cafename: e.target.value })
                      }
                      type="text"
                      className="sm:w-8/10 h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                      placeholder="Enter your Cafe` Name"
                    />
                    <span className="sm:w-full flex gap-1 items-center text-sm font-medium poppins text-neutral-600">
                      <HugeiconsIcon
                        icon={StarIcon}
                        size={14}
                        fill="#c58a53"
                        strokeWidth={0}
                      />{" "}
                      This name will be visible to customers
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:w-1/2">
                  <div className="w-full cntct-number flex flex-col gap-2 my-3">
                    <label
                      className="text-lg poppins font-medium text-[var(--text)]"
                      htmlFor="contact-number"
                    >
                      Contact Number
                    </label>
                    <span className="relative sm:w-8/10">
                      <input
                        value={formData.contactNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNumber: e.target.value,
                          })
                        }
                        type="text"
                        className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="Enter contact number"
                      />
                      <HugeiconsIcon
                        icon={Call02Icon}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--icon-color)] cursor-pointer bg-white"
                        size={25}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                  <div className="w-full whatsapp-number flex flex-col gap-2 my-3">
                    <label className="text-lg poppins font-medium text-[var(--text)]">
                      WhatsApp Number
                    </label>
                    <span className="relative sm:w-8/10">
                      <input
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whatsappNumber: e.target.value,
                          })
                        }
                        type="text"
                        className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="Enter WhatsApp number"
                      />
                      <HugeiconsIcon
                        icon={WhatsappIcon}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--icon-color)] cursor-pointer bg-white"
                        size={25}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                  <div className="w-full address flex flex-col gap-2 my-3">
                    <label className="text-lg poppins font-medium text-[var(--text)]">
                      Address
                    </label>
                    <span className="relative sm:w-8/10">
                      <input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        type="text"
                        className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 pr-10 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="Enter cafe address"
                      />
                      <HugeiconsIcon
                        icon={Location10Icon}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                      text-[var(--icon-color)] cursor-pointer bg-white"
                        size={25}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                  <div className="w-full insta-link flex flex-col gap-2 my-3">
                    <label className="text-lg poppins font-medium text-[var(--text)]">
                      Instagram Link
                    </label>
                    <span className="relative sm:w-8/10">
                      <input
                        value={formData.instagramLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagramLink: e.target.value,
                          })
                        }
                        type="text"
                        className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 pr-10 raleway font-medium focus-visible:outline-none text-[var(--text)] sm:placeholder:text-[var(--dark-heading)]/75 max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="Enter Instagram profile URL"
                      />
                      <HugeiconsIcon
                        icon={InstagramIcon}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--icon-color)] cursor-pointer bg-white"
                        size={25}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex sm:gap-10 max-sm:gap-5 my-8">
                <button
                  onClick={handleSubmit}
                  className="border-2 border-[var(--btn-hover-color)] bg-[var(--btn-hover-color)] text-white px-4 py-2 rounded-[10px] raleway hover:scale-95 transition-all duration-300 font-semibold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
