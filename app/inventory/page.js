"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TaskDaily01Icon } from "@hugeicons/core-free-icons";
import SearchBar from "@/components/SearchBar";
import toast, { Toaster } from "react-hot-toast";

const page = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const MenuItems = await res.json();

      setItems(MenuItems);
    } catch (err) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAvailability = async (item) => {
    try {
      const res = await fetch("/api/items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item._id,
          isAvailable: !item.isAvailable,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update item availability");
      }

      const updatedItem = await res.json();

      setItems((prev) =>
        prev.map((i) => (i._id === updatedItem._id ? updatedItem : i)),
      );
    } catch (err) {
      toast.error("Error in updating item availability:");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full min-h-screen p-5 pt-8">
      <Toaster position="top-center" />
      <div className="title-bar flex flex-col items-center justify-center max-sm:gap-2">
        <div className="title-sec flex gap-2 items-center text-4xl max-sm:text-3xl poppins font-bold text-[var(--dark-heading)]">
          <HugeiconsIcon icon={TaskDaily01Icon} size={45} />
          <h1 className="poppins text-3xl font-bold">Inventory Page</h1>
        </div>
        <span className="sub-tittle text-lg max-sm:text-xs max-sm:font-semibold dm-sans font-medium text-[var(--light-heading)] max-sm:text-center">
          Manage item availability and stock status in real time
        </span>
      </div>
      <div className="flex w-full md:w-8/10 relative justify-center sm:mx-auto max-sm:px-3 py-8">        
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <div className="hidden md:block inventory-table w-[95%] h-max bg-white mt-8 shadow-md rounded-3xl p-5  mx-auto">
        <div className="grid grid-cols-6 gap-4 justify-items-center pb-3 border-b poppins font-semibold text-[var(--light-heading)]">
          <span>Item Name</span>
          <span>Category</span>
          <span>Price (₹)</span>
          <span>Quantity</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="flex flex-col divide-y">
          {loading ? (
            <span className="text-center col-span-4 text-lg text-[var(--text)] poppins py-8">
              Loading...
            </span>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 py-4 items-center justify-items-center poppins font-semibold text-[var(--text)]"
              >
                <span className="font-semibold">{item.name}</span>

                <span>{item.category}</span>

                <span>₹ {item.price}</span>

                <span>{item.quantity}</span>

                <span
                  className={`w-max dm-sans px-3 py-1 rounded-full text-base font-bold
          ${
            item.isAvailable === true
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
                >
                  {item.isAvailable === true ? "Available" : "Out of Stock"}
                </span>

                <div className="flex gap-2 poppins text-sm">
                  <button
                    className={`px-3 py-1.5 rounded-lg border-2 font-semibold transition cursor-pointer
    ${
      item.isAvailable === true
        ? "border-red-500 text-red-700 hover:bg-red-100"
        : "border-green-500 text-green-700 hover:bg-green-100"
    }`}
                    onClick={() => {
                      handleAvailability(item);
                    }}
                  >
                    {item.isAvailable === true ? "Unavailable" : "Available"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <span className="text-center col-span-4 text-lg text-[var(--text)] poppins py-8">
              No items found.
            </span>
          )}
        </div>
      </div>
      <div className="md:hidden flex flex-col gap-4 mt-6">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3"
          >
            <div>
              <h2 className="text-lg font-bold text-[var(--dark-heading)]">
                {item.name}
              </h2>
              <p className="text-sm text-[var(--light-heading)]">
                {item.category}
              </p>
            </div>

            <div className="flex justify-between text-sm font-semibold">
              <span>₹ {item.price}</span>
              <span>Qty: {item.quantity}</span>
            </div>

            <span
              className={`w-max px-3 py-1 rounded-full text-sm font-bold
          ${
            item.isAvailable === true
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
            >
              {item.isAvailable === true ? "Available" : "Out of Stock"}
            </span>

            <button
              className={`w-full mt-2 px-4 py-2 rounded-xl border-2 font-semibold transition
          ${
            item.isAvailable === true
              ? "border-red-500 text-red-700"
              : "border-green-500 text-green-700"
          }`}
              onClick={() => {
                handleAvailability(item);
              }}
            >
              {item.isAvailable === true
                ? "Mark Unavailable"
                : "Mark Available"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
