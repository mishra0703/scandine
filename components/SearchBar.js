"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FrenchFries02Icon } from "@hugeicons/core-free-icons";
import toast, { Toaster } from "react-hot-toast";

const SearchBar = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const dbCategories = await res.json();

        setCategories(dbCategories);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col w-full relative items-center gap-5 my-5 sm:mx-auto">
      <Toaster position="top-center" />
      <div className="relative w-1/2 max-sm:w-full">
        <HugeiconsIcon
          icon={FrenchFries02Icon}
          size={22}
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dark-heading)]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 border-2 border-[var(--icon-color)] rounded-[10px] pl-10 pr-3 raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)] max-sm:placeholder:text-[var(--text)]/50"
          placeholder="Search Item"
        />
      </div>
      <div className="categories w-full">
        <ul className="flex md:justify-center gap-3 max-sm:text-xs flex-wrap max-sm:gap-2 poppins">
          <li
            onClick={() => onCategoryChange("All")}
            className={`px-3 py-1 border-2 border-[var(--icon-color)] rounded-xl cursor-pointer
            ${
              activeCategory === "All"
                ? "bg-[var(--icon-color)] text-white"
                : "bg-transparent text-black"
            }`}
          >
            All
          </li>
          {categories.map((item) => (
            <li
              key={item}
              onClick={() => onCategoryChange(item)}
              className={`px-3 py-1 border-2 border-[var(--icon-color)] rounded-xl cursor-pointer
            ${
              activeCategory === item
                ? "bg-[var(--icon-color)] text-white"
                : "bg-transparent text-black"
            }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
