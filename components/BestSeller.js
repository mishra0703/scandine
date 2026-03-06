"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BestSeller() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/items");
      const data = await res.json();

      const best = data.filter((item) => item.isAvailable).slice(0, 5);
      setItems(best);
    }

    fetchItems();
  }, []);

  const handleSelectItem = (itemId) => {
    router.push(`/order?add=${itemId}`);
  };

  if (loading) {
    return (
      <div className="loader mx-auto my-10">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 px-5">
        {items.map((item) => (
          <div key={item._id} className="">
            <div className="flex flex-col bg-white rounded-3xl h-100 max-sm:h-80 shadow-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 max-sm:h-40 object-cover rounded-t-3xl"
                loading="lazy"
              />
              <div className="px-3 flex gap-2 justify-between items-center pt-3">
                <h3 className="raleway text-lg font-bold">{item.name}</h3>
                <span className="montserrat tracking-wide font-bold text-base whitespace-nowrap">
                  ₹ {item.price}
                </span>
              </div>
              <p className="text-neutral-600 text-xs poppins px-3 mt-1 line-clamp-2">
                {item.description}
              </p>
              <button
                onClick={() => handleSelectItem(item._id)}
                className="montserrat font-semibold w-1/2 mx-auto mt-auto mb-3 bg-[var(--btn-color)] text-white py-2 rounded-xl cursor-pointer"
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
