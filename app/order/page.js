"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Remove01Icon,
  ServingFoodIcon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import SearchBar from "@/components/SearchBar";
import Cart from "@/components/Cart";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// ✅ Separated into its own component so useSearchParams can be safely wrapped in Suspense
const OrderPageContent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderCount, setorderCount] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCartBanner, setShowCartBanner] = useState(false);
  const searchParams = useSearchParams();
  const hasAddedRef = useRef(false);

  const totalItems = Object.values(orderCount).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  useEffect(() => {
    if (totalItems > 0) {
      setShowCartBanner(true);
    } else {
      setShowCartBanner(false);
    }
  }, [totalItems]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const MenuItems = await res.json();

      setItems(MenuItems);
    } catch (err) {
      toast.error("Failed to load items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items
    .filter((item) => item.isAvailable)
    .filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

  useEffect(() => {
    const itemToAdd = searchParams.get("add");

    if (!itemToAdd || items.length === 0) return;
    if (hasAddedRef.current) return;

    setorderCount((prev) => ({
      ...prev,
      [itemToAdd]: 1,
    }));

    hasAddedRef.current = true;
  }, [items]);

  return (
    <div className="w-full flex flex-col relative">
      <Toaster position="top-center" />

      {showCartBanner && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 
                  w-[95%] sm:w-[90%] lg:w-1/2 
                  z-50 
                  bg-[var(--btn2-color)]
                  shadow-lg 
                  rounded-2xl 
                  px-6 py-4 max-sm:py-3 max-sm:px-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold max-sm:text-base text-lg flex gap-2 items-center">
              <HugeiconsIcon icon={ServingFoodIcon} size={25} />
              {totalItems} {totalItems === 1 ? "Item" : "Items"} in cart
            </span>
            <div className="flex items-center gap-4 max-sm:gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-white 
                     text-[var(--btn-color)]
                     px-5 py-2 
                     rounded-xl 
                     font-semibold 
                     transition poppins cursor-pointer"
              >
                View Cart
              </button>

              <button
                onClick={() => setShowCartBanner(false)}
                className="text-white hover:scale-105 transition-all ease-in-out duration-150 cursor-pointer"
              >
                <HugeiconsIcon icon={CancelCircleIcon} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full md:w-8/10 relative justify-center sm:mx-auto max-sm:px-3">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <div className="sm:px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-sm:gap-1 sm:my-8 sm:mb-20 max-sm:mb-25 sm:pb-5">
        {loading ? (
          <span className="text-center col-span-4 text-lg text-[var(--text)] poppins">
            Loading...
          </span>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-5 w-full justify-around max-sm:px-2 max-w-[500px] mx-auto relative max-sm:py-3"
            >
              <div className="flex flex-col justify-center items-center gap-1.5 sm:w-1/4 max-sm:w-4/10 relative">
                <div className="item-photo w-35 h-35 rounded-2xl overflow-hidden relative">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />
                </div>
                <button className="max-sm:hidden rounded-xl w-full h-max cursor-pointer flex items-center my-auto bg-[var(--btn-color)] px-1.5 py-1.5 ">
                  <HugeiconsIcon
                    icon={Remove01Icon}
                    color="#ffffff"
                    strokeWidth={2.5}
                    onClick={() =>
                      setorderCount((prev) => ({
                        ...prev,
                        [item._id]: Math.max((prev[item._id] || 0) - 1, 0),
                      }))
                    }
                  />
                  {orderCount[item._id] > 0 ? (
                    <span className="text-white text-base poppins font-semibold w-12">
                      {orderCount[item._id]}
                    </span>
                  ) : (
                    <span className="text-white text-base poppins font-semibold w-12">
                      Add
                    </span>
                  )}
                  <HugeiconsIcon
                    icon={Add01Icon}
                    color="#ffffff"
                    strokeWidth={2.5}
                    onClick={() =>
                      setorderCount((prev) => ({
                        ...prev,
                        [item._id]: (prev[item._id] || 0) + 1,
                      }))
                    }
                  />
                </button>
                <button className="sm:hidden rounded-3xl relative w-full h-10 cursor-pointer flex items-center justify-center my-auto bg-[var(--btn-color)]">
                  <HugeiconsIcon
                    icon={Remove01Icon}
                    color="#ffffff"
                    strokeWidth={2.5}
                    onClick={() =>
                      setorderCount((prev) => ({
                        ...prev,
                        [item._id]: Math.max((prev[item._id] || 0) - 1, 0),
                      }))
                    }
                  />
                  {orderCount[item._id] > 0 ? (
                    <span className="text-white text-base poppins font-semibold w-15">
                      {orderCount[item._id]}
                    </span>
                  ) : (
                    <span className="text-white text-base poppins font-semibold w-15">
                      Add
                    </span>
                  )}
                  <HugeiconsIcon
                    icon={Add01Icon}
                    color="#ffffff"
                    strokeWidth={2.5}
                    onClick={() =>
                      setorderCount((prev) => ({
                        ...prev,
                        [item._id]: (prev[item._id] || 0) + 1,
                      }))
                    }
                  />
                </button>
              </div>
              <div className="flex flex-col gap-2 sm:w-1/2 max-sm:w-6/10">
                <span className="text-2xl max-sm:text-lg text-[var(--text)] montserrat font-semibold">
                  {item.name}
                </span>
                <span className="price poppins font-semibold text-lg text-neutral-600">
                  ₹ {item.price}
                </span>
                <ul className="description flex gap-5 max-sm:text-sm font-semibold poppins text-neutral-500/75">
                  <li className=" Qty">{item.quantity}</li>
                  {item.isVeg ? (
                    <li className=" Category flex gap-1 items-center">
                      <img src="/veg.svg" className="w-3 h-3" alt="Veg Mark" />
                      <span>Veg</span>
                    </li>
                  ) : (
                    <li className=" Category flex gap-1 items-center">
                      <img
                        src="/non-veg.svg"
                        className="w-3 h-3"
                        alt="Non-Veg Mark"
                      />
                      <span>Non-Veg</span>
                    </li>
                  )}
                </ul>
                <p className="text-[10px] poppins font-semibold text-neutral-500 max-sm:text-neutral-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <span className="text-center col-span-4 text-lg text-[var(--text)] poppins">
            No items found.
          </span>
        )}
      </div>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        orderCount={orderCount}
        setOrderCount={setorderCount}
        items={items}
      />
    </div>
  );
};

// ✅ Default export wraps the content in Suspense — this is what Next.js requires
const page = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center text-lg poppins mt-10">Loading...</div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
};

export default page;
