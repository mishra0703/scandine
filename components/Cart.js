"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Remove01Icon,
  Cancel01Icon,
  PencilEdit02Icon,
  RiceBowl01Icon,
} from "@hugeicons/core-free-icons";
import toast from "react-hot-toast";

const Cart = ({ isOpen, onClose, orderCount, setOrderCount, items }) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("customerInfo");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCustomerName(parsed.name || "");
      setCustomerPhone(parsed.phone || "");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const cartItems = items.filter((item) => orderCount[item._id] > 0);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * orderCount[item._id],
    0,
  );

  const handleRemoveItem = (itemId) => {
    setOrderCount((prev) => ({
      ...prev,
      [itemId]: 0,
    }));
  };

  const handleIncrement = (itemId) => {
    setOrderCount((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleDecrement = (itemId) => {
    setOrderCount((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

  const handleUserConfirm = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Name and phone required");
      return;
    }

    if (!/^[0-9]{10}$/.test(customerPhone)) {
      toast.error("Enter valid 10 digit phone number");
      return;
    }

    localStorage.setItem(
      "customerInfo",
      JSON.stringify({
        name: customerName,
        phone: customerPhone,
      }),
    );

    setShowUserModal(false);

    handleCheckout(customerName, customerPhone);
  };

  const handleCheckout = async (name, phone) => {
    try {
      if (cartItems.length === 0) return;

      const orderPayload = {
        items: cartItems.map((item) => ({
          itemId: item._id,
          qty: orderCount[item._id],
          price: item.price,
        })),
        totalAmount: total,
        note: note,
        name,
        phone,
      };

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to create order");
        return;
      }

      const { razorpayOrderId, amount } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "Cafe Name",
        description: "Order Payment",
        order_id: razorpayOrderId,

        handler: async function (response) {
          const verifyRes = await fetch("/api/verify-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setOrderCount({});
            window.location.href = "/my-orders";
          } else {
            toast.error("Payment verification failed");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 max-sm:px-1 pointer-events-none">
        <div
          className="bg-[var(--card2-bg)] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] max-sm:h-8/10  flex flex-col pointer-events-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-1/4 left-4 w-3 h-3 rounded-full bg-orange-400/40" />
          <div className="absolute bottom-1/4 left-4 w-2 h-2 rounded-full bg-orange-400/40" />
          <div className="absolute top-1/3 right-4 w-2.5 h-2.5 rounded-full bg-orange-400/40" />
          <div className="absolute bottom-1/3 right-4 w-3 h-3 rounded-full bg-orange-400/40" />

          <div className="flex items-center justify-between sm:p-8 sm:pb-4 max-sm:px-5 max-sm:py-4">
            <h2 className="text-4xl max-sm:text-2xl font-bold text-[#3d2817] montserrat">
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={24}
                className="max-sm:w-5 max-sm:h-5"
                color="#3d2817"
              />
            </button>
          </div>

          <hr className="border-[#d4c4b0] mx-8 max-sm:mx-4" />

          <div className="flex-1 overflow-y-auto px-8 py-6 max-sm:px-2 max-sm:py-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-[#3d2817]/60 poppins">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <div className="space-y-5 relative z-100">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 max-sm:p-2"
                  >
                    <div className="w-24 h-24 max-sm:w-18 max-sm:h-18 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl max-sm:text-sm font-semibold text-[#3d2817] montserrat mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm max-sm:text-xs text-[#3d2817]/70 poppins font-medium">
                        <span>{item.quantity}</span>
                        <span>•</span>
                        {item.isVeg ? (
                          <span className="flex items-center gap-1">
                            <img src="/veg.svg" className="w-3 h-3" alt="Veg" />
                            Veg
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <img
                              src="/non-veg.svg"
                              className="w-3 h-3"
                              alt="Non-Veg"
                            />
                            Non-Veg
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-sm max-sm:text-xs text-[var(--text)]/60 hover:text-[var(--text)] font-medium poppins mt-1 cursor-pointer transition-all ease-in-out duration-150"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-[#f7e2c7] rounded-xl shadow-md">
                        <button
                          onClick={() => handleDecrement(item._id)}
                          className="w-10 h-10 max-sm:w-8 max-sm:h-8 flex items-center justify-center rounded-l-xl transition-all ease-in-out duration-200 text-[var(--dark-heading)] cursor-pointer hover:bg-[#ffd9a7]"
                        >
                          <HugeiconsIcon
                            icon={Remove01Icon}
                            size={20}
                            strokeWidth={2.5}
                            className="max-sm:w-4 max-sm:h-4"
                          />
                        </button>
                        <span className="w-8 max-sm:w-5 text-center font-semibold text-[var(--dark-heading)] poppins">
                          {orderCount[item._id]}
                        </span>
                        <button
                          onClick={() => handleIncrement(item._id)}
                          className="w-10 h-10 max-sm:w-8 max-sm:h-8 flex items-center justify-center rounded-r-xl transition-all ease-in-out duration-200 text-[var(--dark-heading)] cursor-pointer hover:bg-[#ffd9a7]"
                        >
                          <HugeiconsIcon
                            icon={Add01Icon}
                            size={20}
                            strokeWidth={2.5}
                            className="max-sm:w-4 max-sm:h-4"
                          />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xl max-sm:text-base font-bold text-[#3d2817] poppins">
                          ₹{item.price * orderCount[item._id]}
                        </p>
                        <p className="text-xs text-[#3d2817]/60 poppins">
                          {orderCount[item._id]} x ₹{item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="px-8 max-sm:px-3 py-4 space-y-4">
              <div className="bg-white/60 rounded-2xl p-4 max-sm:px-3 max-sm:py-2">
                <div className="flex text-[#5f3f28da] items-center gap-2 mb-2">
                  <HugeiconsIcon
                    icon={PencilEdit02Icon}
                    size={22}
                    strokeWidth={2.1}
                    className="max-sm:w-5 max-sm:h-5"
                  />
                  <label className="text-base max-sm:text-sm font-semibold poppins">
                    Add a Note:
                  </label>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any special requests? Add a note for the chef..."
                  className="w-full bg-white/80 rounded-xl px-4 py-3 text-sm text-[#3d2817] placeholder:text-[#3d2817]/40 border-2 focus:outline-none border-orange-400/50 resize-none poppins shadow-orange-400/50 hover:shadow-sm transition-all ease-in-out duration-150 max-sm:text-xs max-sm:px-2 max-sm:py-1.5"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl max-sm:text-lg font-bold text-[#3d2817] montserrat">
                    Total: &nbsp;₹ {total}
                  </p>
                </div>
                <button
                  className="bg-[var(--btn-color)] hover:bg-[var(--btn-hover-color)] text-white px-5 py-3 rounded-2xl transition-all ease-in-out duration-200 shadow-md flex items-center gap-2.5 cursor-pointer max-sm:px-4 max-sm:py-2.5"
                  onClick={() => setShowUserModal(true)}
                >
                  <span className="montserrat text-xl max-sm:text-base font-bold">
                    Place Order
                  </span>
                  <HugeiconsIcon
                    icon={RiceBowl01Icon}
                    strokeWidth={1.8}
                    size={25}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showUserModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-bold">Enter Your Details</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Your Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border p-3 rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleUserConfirm}
                className="px-4 py-2 rounded-lg bg-[var(--btn-color)] text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
