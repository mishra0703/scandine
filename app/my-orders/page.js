"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [hasCustomer, setHasCustomer] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Invalid phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/orders/my", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (!data.success || data.orders.length === 0) {
        toast.error("No customer found with this number");
        setOrders([]);
        return;
      }

      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customerInfo");

    if (storedCustomer) {
      const customer = JSON.parse(storedCustomer);

      if (customer?.phone) {
        setPhone(customer.phone);
        fetchOrders(customer.phone);
      }
    } else {
      setHasCustomer(false);
    }
  }, []);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const activeOrders = sortedOrders.filter((o) => {
    const age = Date.now() - new Date(o.createdAt).getTime();
    const isOlderThan24h = age > 24 * 60 * 60 * 1000;

    return (
      !isOlderThan24h &&
      (o.status === "pending" ||
        o.status === "preparing" ||
        o.status === "placed")
    );
  });

  const historyOrders = sortedOrders.filter((o) => {
    const age = Date.now() - new Date(o.createdAt).getTime();
    const isOlderThan24h = age > 24 * 60 * 60 * 1000;

    return (
      isOlderThan24h ||
      o.status === "completed" ||
      o.status === "cancelled" ||
      o.status === "served"
    );
  });

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000);

    if (diff < 60) return `${diff} mins ago`;

    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return `${hrs} hrs ago`;

    return `${Math.floor(hrs / 24)} days ago`;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Toaster position="top-center" />

      <h1 className="text-2xl font-bold mb-4 poppins">My Orders</h1>

      {!hasCustomer && (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={() => fetchOrders(phone)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            View Orders
          </button>
        </div>
      )}

      {loading && <p className="mt-6">Loading orders...</p>}

      <div className="mt-8 space-y-8">
        {activeOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white/60 backdrop-blur rounded-3xl p-5 shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="poppins text-lg font-semibold">
                  Order #{order._id.slice(-4)}
                </h2>
                <p className="numans flex items-center gap-1 text-xs text-gray-500">
                  <HugeiconsIcon icon={Clock01Icon} size={15} />
                  {timeAgo(order.createdAt)}
                </p>
              </div>

              <span
                className={`capitalize poppins px-4 py-1 rounded-full text-sm font-medium ${
                  order.status === "placed"
                    ? "bg-green-300 text-green-700"
                    : "bg-amber-300 text-amber-700/80"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="border-t pt-4 space-y-4 px-5">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.itemId?.image}
                    alt={item.itemId?.name}
                    className="w-15 h-15 object-cover rounded-lg "
                  />

                  <div className="flex-1">
                    <p className="font-medium montserrat">
                      {item.itemId?.name} x {item.qty}
                    </p>

                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      {item.itemId?.isVeg ? (
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
                    </p>
                  </div>

                  <p className="font-semibold text-lg montserrat tracking-wide">
                    ₹ {item.price}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-4 px-5">
              <span className="item-qty font-semibold poppins tracking-wide text-lg">
                Qty : {order.items.length}
              </span>
              <p className="text-lg font-semibold poppins tracking-wide">
                Total : ₹ {order.totalAmount}
              </p>
            </div>
          </div>
        ))}

        {historyOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 poppins">
              Your Order History
            </h2>

            <div className="space-y-4">
              {historyOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-neutral-200/75 shadow-md rounded-2xl p-5"
                >
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 mb-3"
                    >
                      <img
                        src={item.itemId?.image}
                        alt={item.itemId?.name}
                        className="w-15 h-15 object-cover rounded-lg grayscale"
                      />

                      <div className="flex-1">
                        <p className="font-medium montserrat">
                          {item.itemId?.name} x {item.qty}
                        </p>

                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          {item.itemId?.isVeg ? (
                            <span className="flex items-center gap-1">
                              <img
                                src="/veg.svg"
                                className="w-3 h-3 grayscale"
                                alt="Veg"
                              />
                              Veg
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <img
                                src="/non-veg.svg"
                                className="w-3 h-3 grayscale"
                                alt="Non-Veg"
                              />
                              Non-Veg
                            </span>
                          )}
                        </p>
                      </div>

                      <p className="font-semibold text-lg montserrat tracking-wide">
                        ₹ {item.price}
                      </p>
                    </div>
                  ))}

                  <div className="flex justify-between items-center mt-4 border-t pt-4 px-5">
                    <span className="font-semibold poppins tracking-wide text-lg">
                      Qty : {order.items.length}
                    </span>

                    <p className="text-lg font-semibold poppins tracking-wide">
                      Total : ₹ {order.totalAmount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
