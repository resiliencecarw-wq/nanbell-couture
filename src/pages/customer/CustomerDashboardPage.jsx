import { useEffect, useState } from "react";
import api from "../../api/client";
import { resolveImageUrl } from "../../utils/image";

const statusColors = {
  "Not Started": "border-slate-200 bg-slate-100 text-slate-700",
  "In Progress": "border-amber-200 bg-amber-100 text-amber-700",
  "Almost Done": "border-indigo-200 bg-indigo-100 text-indigo-700",
  "Ready for Pickup": "border-emerald-200 bg-emerald-100 text-emerald-700",
  "Transaction Completed": "border-[#0f8b6e] bg-[#dff6ef] text-[#0f8b6e]"
};

const CustomerDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-slate-600">Track both shop purchases and custom sewing orders in real time.</p>
      </div>

      {loading && (
        <div className="grid gap-4">
          {[1, 2].map((n) => (
            <div key={n} className="panel p-4">
              <div className="skeleton h-28 w-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="panel p-6 text-sm text-slate-600">You do not have any orders yet.</div>
      )}

      <div className="grid gap-4">
        {orders.map((order) => {
          const displayStatus = order.transactionCompleted ? "Transaction Completed" : order.status;
          const orderName = order.orderType === "shop" ? order.shopItem?.name : (order.dressType || order.template?.name);
          const orderImage = order.shopItem?.imageUrl || order.template?.imageUrl;
          return (
            <article key={order._id} className="panel p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start">
                <img
                  src={orderImage ? resolveImageUrl(orderImage) : "https://via.placeholder.com/160x130?text=No+Image"}
                  alt={orderName || "Order"}
                  className="h-32 w-full rounded-xl object-cover md:w-40"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{orderName}</p>
                      <p className="text-xs text-slate-500">Code: {order.orderCode}</p>
                    </div>
                    <span className={`badge ${statusColors[displayStatus] || "border-slate-200 bg-slate-100 text-slate-700"}`}>{displayStatus}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-3">
                    <p>Type: <span className="font-semibold text-slate-800">{order.orderType === "shop" ? "Shop Order" : "Custom Sewing"}</span></p>
                    <p>Quantity: <span className="font-semibold text-slate-800">{order.quantity || 1}</span></p>
                    <p>Size: <span className="font-semibold text-slate-800">{order.size || "-"}</span></p>
                  </div>
                  {order.showEstimatedDate ? (
                    <p className="mt-2 text-sm text-slate-600">Expected completion: {new Date(order.expectedCompletionDate).toLocaleDateString()}</p>
                  ) : (
                    <p className="mt-2 text-sm text-[#0f8b6e]">Estimated completion date will be shared soon.</p>
                  )}
                  {order.notes && <p className="mt-1 text-sm text-slate-500">Note: {order.notes}</p>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
