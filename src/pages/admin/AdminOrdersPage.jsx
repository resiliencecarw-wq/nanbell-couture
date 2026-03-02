import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/image";
import OrderTimeline from "../../components/OrderTimeline";

const STATUS_OPTIONS = ["Not Started", "In Progress", "Almost Done", "Ready for Pickup"];

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [form, setForm] = useState({ customer: "", dressType: "", expectedCompletionDate: "", showEstimatedDate: true, notes: "", size: "", quantity: 1 });

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (_e) {
      showToast("Failed to load orders.", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (query = "") => {
    try {
      const { data } = await api.get(`/customers?search=${encodeURIComponent(query)}`);
      setCustomers(data);
      if (query) showToast(`Found ${data.length} customer(s).`);
    } catch (_e) {
      showToast("Failed to search customers.", "error");
    }
  };

  useEffect(() => {
    loadOrders();
    searchCustomers("");
  }, []);

  const createCustomOrder = async (e) => {
    e.preventDefault();
    if ((Number(form.quantity) || 0) < 1) {
      showToast("Quantity must be at least 1.", "error");
      return;
    }
    try {
      await api.post("/orders", {
        ...form,
        quantity: Number(form.quantity) || 1,
        showEstimatedDate: !!form.showEstimatedDate
      });
      showToast("Custom order created.");
      setForm({ customer: "", dressType: "", expectedCompletionDate: "", showEstimatedDate: true, notes: "", size: "", quantity: 1 });
      await loadOrders();
    } catch (_e) {
      showToast("Failed to create order.", "error");
    }
  };

  const updateOrder = async (orderId, status, expectedCompletionDate, showEstimatedDate) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status, expectedCompletionDate, showEstimatedDate });
      showToast("Order updated.");
      await loadOrders();
    } catch (_e) {
      showToast("Failed to update order.", "error");
    }
  };

  const completeTransaction = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/complete-transaction`);
      showToast("Transaction marked as completed.");
      await loadOrders();
    } catch (_e) {
      showToast("Failed to complete transaction.", "error");
    }
  };

  const filteredOrders = useMemo(() => {
    let next = orders;
    if (statusFilter !== "All") next = next.filter((o) => o.status === statusFilter);
    if (typeFilter !== "All") next = next.filter((o) => o.orderType === typeFilter);
    return next;
  }, [orders, statusFilter, typeFilter]);

  const activeOrders = filteredOrders.filter((o) => !o.transactionCompleted && o.status !== "Ready for Pickup");
  const readyForPickupOrders = filteredOrders.filter((o) => !o.transactionCompleted && o.status === "Ready for Pickup");
  const completedOrders = filteredOrders.filter((o) => o.transactionCompleted);

  const renderOrderCard = (order, showCompleteButton = false, compact = false) => {
    const orderName = order.orderType === "shop" ? order.shopItem?.name : (order.dressType || order.template?.name);
    const orderImage = order.shopItem?.imageUrl || order.template?.imageUrl;
    return (
      <article key={order._id} className={`panel ${compact ? "border-[#b6e3d8] bg-[#edfbf6]" : ""} p-4`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          <img
            src={orderImage ? resolveImageUrl(orderImage) : "https://via.placeholder.com/160x130?text=No+Image"}
            alt={orderName || "Order"}
            className={`${compact ? "h-28 md:w-36" : "h-32 md:w-40"} w-full rounded-xl object-cover`}
          />
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{order.orderCode} - {order.customer?.fullName} - {orderName || "Dress"}</p>
              <p className="text-sm text-slate-600">Due: {new Date(order.expectedCompletionDate).toLocaleDateString()}</p>
            </div>
            <p className="mb-2 text-xs text-slate-500">Type: {order.orderType === "shop" ? "Shop Order" : "Custom Sewing"} | Size: {order.size || "-"} | Qty: {order.quantity || 1}</p>
            <OrderTimeline status={order.status} transactionCompleted={!!order.transactionCompleted} />

            {compact ? (
              <p className="text-sm text-slate-600">Completed on: {order.completedAt ? new Date(order.completedAt).toLocaleDateString() : "-"}</p>
            ) : (
              <div className="mt-3 grid gap-2 text-sm md:flex md:flex-wrap md:items-center">
                <select
                  className="field w-full md:max-w-xs"
                  value={order.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value;
                    setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: nextStatus } : o)));
                  }}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <input
                  type="date"
                  className="field w-full md:max-w-xs"
                  value={new Date(order.expectedCompletionDate).toISOString().slice(0, 10)}
                  onChange={(e) => {
                    const nextDate = e.target.value;
                    setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, expectedCompletionDate: nextDate } : o)));
                  }}
                />
                <label className="field flex w-full items-center gap-2 md:max-w-xs">
                  <input
                    type="checkbox"
                    checked={!!order.showEstimatedDate}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, showEstimatedDate: checked } : o)));
                    }}
                  />
                  Show date to client
                </label>
                <button onClick={() => updateOrder(order._id, order.status, order.expectedCompletionDate, order.showEstimatedDate)} className="btn-ghost">Save Update</button>
                {showCompleteButton && (
                  <button onClick={() => completeTransaction(order._id)} className="btn-primary">Mark Transaction Completed</button>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <p className="text-slate-600">Ready for pickup is tracked separately from transaction completed.</p>
      </div>

      <details className="panel group p-4" open>
        <summary className="cursor-pointer list-none text-xl font-semibold">
          Create Custom Sewing Order
          <span className="ml-2 text-sm font-medium text-slate-500 group-open:hidden">(tap to open)</span>
        </summary>
      <form onSubmit={createCustomOrder} className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2 space-y-2">
          <input className="field" placeholder="Search customer by name/phone" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} />
          <div className="grid gap-2 md:flex">
            <button type="button" onClick={() => searchCustomers(customerSearch)} className="btn-ghost">Search Customer</button>
            <select value={form.customer} onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))} className="field" required>
              <option value="">Select customer from results</option>
              {customers.map((c) => <option key={c._id} value={c._id}>{c.fullName} ({c.phone})</option>)}
            </select>
          </div>
        </div>

        <input value={form.dressType} onChange={(e) => setForm((p) => ({ ...p, dressType: e.target.value }))} placeholder="Dress type (type manually)" className="field" required />
        <input type="date" value={form.expectedCompletionDate} onChange={(e) => setForm((p) => ({ ...p, expectedCompletionDate: e.target.value }))} className="field" required />
        <input value={form.size} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))} placeholder="Size" className="field" />
        <input value={form.quantity} type="number" min="1" onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="Quantity" className="field" />
        <input value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes (optional)" className="field md:col-span-2" />
        <label className="field md:col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={!!form.showEstimatedDate} onChange={(e) => setForm((p) => ({ ...p, showEstimatedDate: e.target.checked }))} />
          Client can see estimated completion date
        </label>

        <button className="btn-primary md:col-span-2">Create Custom Order</button>
      </form>
      </details>

      <div className="panel sticky top-20 z-10 flex flex-col gap-2 p-3 md:flex-row md:items-center">
        <label className="text-sm font-semibold">Filter by status:</label>
        <select className="field w-full md:max-w-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="text-sm font-semibold">Type:</label>
        <select className="field w-full md:max-w-xs" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="custom">Custom</option>
          <option value="shop">Shop</option>
        </select>
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Active Orders</h2>
        {loading && <div className="panel p-4 text-sm text-slate-600">Loading orders...</div>}
        {!loading && activeOrders.length === 0 && <div className="panel p-4 text-sm text-slate-600">No active orders.</div>}
        {activeOrders.map((order) => renderOrderCard(order))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-[#b67600]">Ready for Pickup</h2>
        {!loading && readyForPickupOrders.length === 0 && <div className="panel p-4 text-sm text-slate-600">No orders currently ready for pickup.</div>}
        {readyForPickupOrders.map((order) => renderOrderCard(order, true))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-[#0f8b6e]">Transaction Completed</h2>
        {!loading && completedOrders.length === 0 && <div className="panel p-4 text-sm text-slate-600">No completed transactions yet.</div>}
        {completedOrders.map((order) => renderOrderCard(order, false, true))}
      </section>
    </div>
  );
};

export default AdminOrdersPage;
