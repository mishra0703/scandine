"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ThumbsUpIcon,
  Clock05Icon,
  SendingOrderIcon,
  HourglassIcon,
  LabelImportantIcon,
} from "@hugeicons/core-free-icons";
import toast, { Toaster } from "react-hot-toast";

const page = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]);
  const ActiveStatus = ["pending", "placed", "preparing"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast.error("Error fetching orders:");
      }
    };

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const todayOrders = useMemo(() => {
    const today = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
  }, [orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to update status");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      toast.error("Error updating order:");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="p-5 flex w-full flex-col gap-8 max-sm:px-1.5">
        <div className="title-bar flex flex-col justify-center">
          <div className="title-sec flex gap-2 items-center text-4xl max-sm:text-3xl poppins font-bold text-[var(--dark-heading)]">
            <HugeiconsIcon icon={SendingOrderIcon} size={45} />
            <h1 className="poppins text-3xl font-bold">Live Orders</h1>
          </div>
          <span className="sub-tittle text-base max-sm:text-sm max-sm:font-semibold dm-sans font-medium text-[var(--light-heading)]">
            Track and manage incoming orders as they happen
          </span>
        </div>
        <div className="sm:hidden flex gap-3 mb-5">
          {["pending", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl font-semibold poppins capitalize transition
        ${
          activeTab === tab
            ? "bg-[var(--card-bg)] text-white"
            : "bg-gray-200 text-gray-600"
        }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="orders-sec flex max-sm:flex-col w-full mx-auto gap-10">
          <div
            className={`pending-orders w-1/3 max-sm:w-full h-max shadow-md rounded-3xl flex flex-col
    ${activeTab !== "pending" ? "max-sm:hidden" : ""}`}
          >
            <span className="order-category w-full p-2.5 pl-8 rounded-t-3xl bg-amber-400 text-[var(--text)]/95 font-bold poppins tracking-wide text-2xl">
              Pending Orders
            </span>
            <div className="w-full px-3 py-5 h-max">
              {todayOrders.filter((item) => ActiveStatus.includes(item.status))
                .length > 0 ? (
                todayOrders
                  .filter((item) => ActiveStatus.includes(item.status))
                  .map((item, i) => (
                    <div
                      key={i}
                      className="order-box w-9/10 max-sm:w-full mx-auto h-max bg-white shadow-md flex flex-col gap-5 mb-3 p-3 rounded-xl "
                    >
                      <div className="order-info flex justify-between items-center">
                        <span className="order-id font-bold text-lg dm-sans text-neutral-500">
                          #{item._id.slice(-6)}
                        </span>
                        <div className="customer flex flex-col">
                          <span className="customer-name max-sm:text-sm font-semibold text-[var(--text)] poppins">
                            {item.customerName || "Unknown Customer"}
                          </span>
                          <span className="customer-contact max-sm:text-xs text-sm text-gray-500 poppins">
                            {item.customerPhone || "No contact info"}
                          </span>
                        </div>
                      </div>
                      <div className="item-info flex flex-col gap-2">
                        {item.items.map((orderItem) => (
                          <div
                            key={orderItem._id}
                            className="flex items-center gap-2"
                          >
                            <span className="item-qty bg-[var(--card-bg)] w-7 h-7 flex justify-center items-center rounded-full text-white font-semibold poppins tracking-wide text-sm">
                              X{orderItem.qty}
                            </span>
                            <span className="item-name font-semibold text-lg text-[var(--text)] poppins">
                              {orderItem.itemId?.name}
                            </span>
                            <span className="item-name font-medium text-base text-[var(--text)] poppins">
                              ({orderItem.itemId?.quantity})
                            </span>
                          </div>
                        ))}
                      </div>
                      {item.note && (
                        <div className="poppins flex gap-1 items-center">
                          <HugeiconsIcon
                            icon={LabelImportantIcon}
                            size={22}
                            strokeWidth={0.5}
                            fill="var(--nav-bg)"
                            className="text-[var(--nav-bg)]"
                          />
                          <span className="font-bold text-[var(--text)]">
                            Note :
                          </span>
                          <span className="font-medium text-[var(--dark-heading)]">
                            {" "}
                            {item.note}
                          </span>
                        </div>
                      )}
                      <hr />
                      <div className="action-btns flex justify-between">
                        <button
                          onClick={() =>
                            updateOrderStatus(item._id, "completed")
                          }
                          className="border-green-400 hover:bg-green-300 transition-all ease-in-out duration-300 text-green-700 font-semibold px-2 p-1 rounded-xl border-2 poppins cursor-pointer"
                        >
                          Completed
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(item._id, "cancelled")
                          }
                          className="border-red-400 hover:bg-red-300 transition-all ease-in-out duration-300 text-red-500 font-semibold px-2 p-1 rounded-xl border-2 poppins cursor-pointer"
                        >
                          Cancelled
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <span className="w-full flex justify-center items-center gap-2 font-semibold text-gray-500 poppins">
                  <HugeiconsIcon icon={Clock05Icon} />
                  Waiting for someone to order
                </span>
              )}
            </div>
          </div>

          <div
            className={`completed-orders w-1/3 max-sm:w-full h-max shadow-md rounded-3xl flex flex-col
    ${activeTab !== "completed" ? "max-sm:hidden" : ""}`}
          >
            <span className="order-category w-full p-2.5 pl-8 rounded-t-3xl text-green-800 font-bold poppins tracking-wide text-2xl bg-green-400">
              Completed Orders
            </span>
            <div className="w-full px-3 py-5 h-max">
              {todayOrders.filter((item) => item.status === "completed")
                .length > 0 ||
              todayOrders.filter((item) => item.status === "served").length >
                0 ? (
                todayOrders
                  .filter(
                    (item) =>
                      item.status === "completed" || item.status === "served",
                  )
                  .map((item, i) => (
                    <div
                      key={i}
                      className="order-box w-9/10 max-sm:w-full mx-auto h-max bg-white shadow-md flex flex-col gap-5 mb-3 p-3 rounded-xl "
                    >
                      <div className="order-info flex justify-between items-center">
                        <span className="order-id font-bold text-lg dm-sans text-neutral-500">
                          #{item._id.slice(-6)}
                        </span>
                        <div className="customer flex flex-col">
                          <span className="customer-name max-sm:text-sm font-semibold text-[var(--text)] poppins">
                            {item.customerName || "Unknown Customer"}
                          </span>
                          <span className="customer-contact max-sm:text-xs text-sm text-gray-500 poppins">
                            {item.customerPhone || "No contact info"}
                          </span>
                        </div>
                      </div>
                      <div className="item-info flex flex-col gap-2">
                        {item.items.map((orderItem) => (
                          <div
                            key={orderItem._id}
                            className="flex items-center gap-2"
                          >
                            <span className="item-qty bg-[var(--card-bg)] w-7 h-7 flex justify-center items-center rounded-full text-white font-semibold poppins tracking-wide text-sm">
                              X{orderItem.qty}
                            </span>
                            <span className="item-name font-semibold text-lg text-[var(--text)] poppins">
                              {orderItem.itemId?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      {item.note && (
                        <div className="poppins text-sm">
                          <span className="font-bold">Note :</span> {item.note}
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <span className="w-full flex justify-center items-center gap-2 font-semibold text-gray-500 poppins">
                  <HugeiconsIcon icon={HourglassIcon} />
                  Waiting for order to complete
                </span>
              )}
            </div>
          </div>

          <div
            className={`cancelled-orders w-1/3 max-sm:w-full h-max shadow-md rounded-3xl flex flex-col
    ${activeTab !== "cancelled" ? "max-sm:hidden" : ""}`}
          >
            <span className="order-category w-full p-2.5 pl-8 rounded-t-3xl text-red-800 font-bold poppins tracking-wide text-2xl bg-red-400">
              Cancelled Orders
            </span>
            <div className="w-full px-3 py-5 h-max ">
              {todayOrders.filter((item) => item.status === "cancelled")
                .length > 0 ? (
                todayOrders
                  .filter((item) => item.status === "cancelled")
                  .map((item, i) => (
                    <div
                      key={i}
                      className="order-box w-9/10 max-sm:w-full mx-auto h-max bg-white shadow-md flex flex-col gap-5 mb-3 p-3 rounded-xl "
                    >
                      <div className="order-info flex justify-between items-center">
                        <span className="order-id font-bold text-lg dm-sans text-neutral-500">
                          #{item._id.slice(-6)}
                        </span>
                        <div className="customer flex flex-col">
                          <span className="customer-name max-sm:text-sm font-semibold text-[var(--text)] poppins">
                            {item.customerName || "Unknown Customer"}
                          </span>
                          <span className="customer-contact max-sm:text-xs text-sm text-gray-500 poppins">
                            {item.customerPhone || "No contact info"}
                          </span>
                        </div>
                      </div>
                      <div className="item-info flex flex-col gap-2">
                        {item.items.map((orderItem) => (
                          <div
                            key={orderItem._id}
                            className="flex items-center gap-2"
                          >
                            <span className="item-qty bg-[var(--card-bg)] w-7 h-7 flex justify-center items-center rounded-full text-white font-semibold poppins tracking-wide text-sm">
                              X{orderItem.qty}
                            </span>
                            <span className="item-name font-semibold text-lg text-[var(--text)] poppins">
                              {orderItem.itemId?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      {item.note && (
                        <span>
                          <span className="font-bold">Note :</span> {item.note}
                        </span>
                      )}
                    </div>
                  ))
              ) : (
                <span className="w-full flex justify-center items-center gap-2 font-semibold text-gray-500 poppins">
                  <HugeiconsIcon icon={ThumbsUpIcon} />
                  No cancelled orders yet
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
