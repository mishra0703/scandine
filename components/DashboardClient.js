"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, ChefIcon } from "@hugeicons/core-free-icons";
import {
  MoneyBag02Icon,
  Pan03Icon,
  ServingFoodIcon,
  TaskEdit01Icon,
  UnavailableIcon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons/index";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";

export default function DashboardClient() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [orderFilter, setOrderFilter] = useState("pending");
  const [adminData, setAdminData] = useState({});
  const { data: session } = useSession();
  const ActiveStatus = ["pending", "placed", "preparing"];

  useEffect(() => {
    document.title = "Dashboard | Admin";

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

  useEffect(() => {
    const fetchAdmin = async () => {
      const res = await fetch("/api/admin/me");
      const data = await res.json();

      setAdminData({
        name: data.name,
        profilepic: data.profilepic,
      });
    };

    if (session) fetchAdmin();
  }, [session]);

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

  const totalEarnings = useMemo(() => {
    return todayOrders
      .filter((order) => order.paid && order.status !== "cancelled")
      .reduce((acc, order) => acc + order.totalAmount, 0);
  }, [todayOrders]);

  const unavailableItems = items.filter(
    (item) => item.isAvailable === false,
  ).length;

  const totalOrders = todayOrders.length;

  const activeOrders = useMemo(() => {
    return todayOrders.filter((item) => ActiveStatus.includes(item.status));
  }, [todayOrders]);

  const filteredOrders = useMemo(() => {
    return todayOrders
      .filter((order) => {
        if (orderFilter === "all") return true;

        if (orderFilter === "pending") {
          return ActiveStatus.includes(order.status);
        }

        if (orderFilter === "completed") {
          return order.status === "completed" || order.status === "served";
        }

        return order.status === orderFilter;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [todayOrders, orderFilter]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const MenuItems = await res.json();

      setItems(MenuItems);
    } catch (err) {
      toast.error("Failed to load items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Toaster position="top-center" />

      <div className="flex flex-col items-center max-sm:items-start mt-5 p-6 rounded-2xl">
        <div className="admin-profile rounded-full overflow-hidden w-40 h-40 shadow-md">
          <img
            src={adminData.profilepic || "/admin.jpg"}
            alt="admin profile pic"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-4xl max-sm:text-xl raleway font-bold flex items-center">
          <span className="text-[var(--text)]">Welcome back,</span>
          <span className="text-[var(--light-heading)] pl-1 ">
            &nbsp;{adminData.name?.split(" ")[0]}{" "}
          </span>
          <HugeiconsIcon
            icon={ChefIcon}
            size={45}
            strokeWidth={2}
            className="max-sm:w-8 max-sm:h-8 mb-2.5 sm:mx-2 text-[var(--light-heading)]"
          />
        </div>
        <span className="max-sm:text-xs italic max-sm:font-semibold numans text-[var(--heading)]">
          "Here's your cafe perfomance today"
        </span>
      </div>
      <div className="flex flex-col items-center px-5 w-full my-10">
        <div className="max-sm:mt-10 max-sm:text-2xl text-3xl w-full flex px-1">
          <span className="poppins font-semibold text-[var(--dark-heading)]">
            Today's &nbsp;Overview :
          </span>
        </div>
        <div className="flex max-sm:flex-col items-center w-full gap-5">
          <section className="orders-row w-full sm:w-9/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-6">
            <div className="revenue data-box bg-white shadow-lg flex items-center gap-8 rounded-4xl p-4">
              <div className="flex items-center justify-center">
                <HugeiconsIcon
                  icon={MoneyBag02Icon}
                  size={50}
                  fill="yellow"
                  strokeWidth={1.5}
                  className="p-2 border-2 rounded-full border-green-500 text-[var(--text)]"
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="data text-[var(--text)] text-4xl montserrat font-bold">
                  ₹ {totalEarnings}
                </span>
                <span className="title text-[var(--nav-bg)] text-lg numans font-semibold">
                  Total Earnings today
                </span>
              </div>
            </div>
            <div className="orders-count data-box bg-white shadow-lg flex items-center gap-8 rounded-4xl p-4">
              <div className="flex items-center justify-center">
                <HugeiconsIcon
                  icon={ServingFoodIcon}
                  size={50}
                  strokeWidth={1.5}
                  className="p-2 border-2 rounded-full border-[var(--dark-heading)] text-[var(--text)]"
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="data text-[var(--text)] text-4xl montserrat font-bold">
                  {totalOrders}
                </span>
                <span className="title text-[var(--nav-bg)] text-lg numans font-semibold">
                  Total Orders
                </span>
              </div>
            </div>
            <div className="active-orders-count data-box bg-white shadow-lg flex items-center gap-8 rounded-4xl p-4">
              <div className="flex items-center justify-center">
                <HugeiconsIcon
                  icon={Pan03Icon}
                  size={50}
                  fill="gray"
                  strokeWidth={1.5}
                  className="p-2 border-2 rounded-full border-neutral-500 text-neutral-400]"
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="data text-[var(--text)] text-4xl montserrat font-bold">
                  {activeOrders.length}
                </span>
                <span className="title text-[var(--nav-bg)] text-lg numans font-semibold">
                  Active Orders
                </span>
              </div>
            </div>
            <div className="Unavailable-items-count data-box bg-white shadow-lg flex items-center gap-8 rounded-4xl p-4">
              <div className="flex items-center justify-center">
                <HugeiconsIcon
                  icon={UnavailableIcon}
                  size={50}
                  strokeWidth={1.5}
                  className="text-red-600"
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="data text-[var(--text)] text-4xl montserrat font-bold">
                  {unavailableItems}
                </span>
                <span className="title text-[var(--nav-bg)] text-lg numans font-semibold">
                  Unavailable Items
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="flex flex-col items-center px-5 w-full my-10">
        <div className="mt-5 max-sm:mt-20 max-sm:text-xl text-3xl w-full flex items-center max-sm:justify-between gap-2 px-1">
          <span className="poppins sm:w-2/10 font-semibold text-[var(--dark-heading)]">
            Live &nbsp;Orders :
          </span>
          {todayOrders.length > 0 && (
            <>
              <hr className="max-sm:hidden w-full border-2 border-[var(--dark-heading)] rounded-xl" />
              <div className="relative poppins max-sm:text-sm text-base cursor-pointer sm:w-2/10">
                <Select value={orderFilter} onValueChange={setOrderFilter}>
                  <SelectTrigger className="w-[180px] poppins bg-[var(--btn-color)] text-white px-2.5 py-2 rounded-xl border-2 cursor-pointer font-medium focus:outline-none border-none">
                    <SelectValue placeholder="Select Order Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Active Orders</SelectItem>
                      <SelectItem value="completed">
                        Completed Orders
                      </SelectItem>
                      <SelectItem value="cancelled">
                        Cancelled Orders
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <div className="flex max-sm:flex-col items-center w-full gap-3">
          {todayOrders.length < 1 ? (
            <span className="w-max my-5 mx-auto max-sm:text-xl text-3xl font-bold montserrat text-neutral-400">
              Waiting for an order !
            </span>
          ) : (
            <>
              <section className="live-orders-preview w-full sm:w-9/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 my-5">
                {filteredOrders.map((order) => {
                  const orderTime = new Date(order.createdAt);

                  const statusStyles = {
                    placed: "bg-green-300 text-green-700 border-green-500",
                    preparing: "bg-amber-300 text-yellow-700 border-yellow-500",
                    completed: "bg-green-100 text-green-700 border-green-300",
                    served: "bg-blue-100 text-blue-700 border-blue-300",
                    cancelled: "bg-red-100 text-red-700 border-red-300",
                  };

                  const statusClass =
                    statusStyles[order.status] ||
                    "bg-gray-100 text-gray-700 border-gray-300";

                  const minutesAgo = Math.floor(
                    (Date.now() - orderTime.getTime()) / (1000 * 60),
                  );

                  const totalQty = order.items.reduce(
                    (acc, item) => acc + Number(item.qty),
                    0,
                  );

                  return (
                    <div
                      key={order._id}
                      className="order-box p-4 bg-[var(--bg)] rounded-3xl shadow-lg flex flex-col max-h-80"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xl text-neutral-800 montserrat font-bold">
                            Order #{order._id.slice(-4)}
                          </span>
                          <span className="date-time flex gap-3 text-xs text-neutral-500 font-bold numans mt-1.5">
                            <span>{minutesAgo} mins ago</span>
                          </span>
                        </div>
                        <div className="order-status">
                          <span
                            className={`poppins px-3 py-1 rounded-full text-sm font-semibold border capitalize ${statusClass}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="items flex flex-col gap-3 my-5 h-max overflow-y-auto scrollbar-hide">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="item w-full flex gap-3 items-center justify-between border-2 border-neutral-500 p-4 rounded-2xl shadow-sm"
                          >
                            <div className="item-info flex flex-col gap-1.5">
                              <div className="qty_&_name flex  gap-2 items-center ">
                                <span className="item-qty border-2 border-[var(--btn-color)] px-1.5 py-1 rounded-full  font-bold raleway text-base text-[var(--dark-heading)]">
                                  x {item.qty}
                                </span>
                                <span className="text-lg max-sm:text-base text-[var(--text)] numans font-semibold">
                                  {item.itemId.name}
                                </span>
                              </div>
                              <ul className="description flex gap-5 max-sm:text-xs text-sm font-semibold poppins text-neutral-500/75">
                                <li className=" Qty">{item.itemId.quantity}</li>
                                <li className=" Category flex gap-1 items-center">
                                  <img
                                    src={
                                      item.itemId.isVeg
                                        ? "/Veg.svg"
                                        : "/Non-veg.svg"
                                    }
                                    className="w-3 h-3"
                                    alt="Veg Mark"
                                  />
                                  <span>
                                    {item.itemId.isVeg ? "Veg" : "Non-Veg"}
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <div className="w-1/5 item-qty flex justify-end text-base numans font-semibold text-neutral-600">
                              ₹ {item.price * Number(item.qty)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <hr />
                      <div className="order-info mt-3 flex justify-around montserrat text-neutral-950">
                        <div className="order-value font-medium">
                          ₹ {order.totalAmount}
                        </div>
                        <div className="order-qty flex justify-end text-sm font-semibold">
                          Qty : {totalQty}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center px-5 w-full my-10">
        <div className="mt-5 max-sm:mt-20 max-sm:text-2xl text-3xl w-full flex px-1">
          <span className="poppins font-semibold text-[var(--dark-heading)]">
            Quick Shortcuts :
          </span>
        </div>
        <section className="quick-action-s w-full grid grid-cols-4 max-sm:grid-cols-1 gap-8 my-6 px-1">
          <div className="action  flex flex-col gap-2 bg-white shadow-md border-2 border-neutral-300 rounded-2xl px-5 py-3 items-center">
            <Link
              href="/item"
              className="w-max flex justify-center items-center gap-1.5 "
            >
              <HugeiconsIcon
                icon={Add01Icon}
                size={30}
                strokeWidth={3}
                className="cursor-pointer p-0.5 border-3 rounded-full border-[var(--btn-color)] text-[var(--text)]"
              />
              <span className="font-bold poppins text-xl text-[var(--text)]">
                Add New Item
              </span>
            </Link>
            <span className="sm:text-sm text-xs font-medium tracking-wide montserrat text-[var(--dark-heading)]">
              Add a new dish to the menu
            </span>
          </div>
          <div className="action  flex flex-col gap-2 bg-white shadow-md border-2 border-neutral-300 rounded-2xl px-5 py-3 items-center">
            <Link
              href="/inventory"
              className="w-max flex justify-center items-center gap-1.5 "
            >
              <HugeiconsIcon
                icon={TaskEdit01Icon}
                size={28}
                strokeWidth={2}
                className="cursor-pointer text-[var(--text)]"
              />
              <span className="font-bold poppins text-xl text-[var(--text)]">
                Manage Availabilty
              </span>
            </Link>
            <span className="sm:text-sm text-xs font-medium tracking-wide montserrat text-[var(--dark-heading)]">
              Update unavailable items
            </span>
          </div>
          <div className="action  flex flex-col gap-2 bg-white shadow-md border-2 border-neutral-300 rounded-2xl px-5 py-3 items-center">
            <Link
              href="/profile"
              className="w-max flex justify-center items-center gap-1.5 "
            >
              <HugeiconsIcon
                icon={UserEdit01Icon}
                size={28}
                strokeWidth={2}
                className="cursor-pointer text-[var(--text)]"
              />
              <span className="font-bold poppins text-xl text-[var(--text)]">
                Edit Profile
              </span>
            </Link>
            <span className="sm:text-sm text-xs font-medium tracking-wide montserrat text-[var(--dark-heading)]">
              Update your profile information
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
