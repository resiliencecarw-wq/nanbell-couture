import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveImageUrl } from "../utils/image";

const defaultOrder = { size: "", quantity: 1, notes: "" };

const ShopPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState("");
  const [orderForm, setOrderForm] = useState(defaultOrder);

  useEffect(() => {
    api.get("/shop-items")
      .then(({ data }) => setItems(data.filter((i) => i.available)))
      .finally(() => setLoading(false));
  }, []);

  const placeOrder = async (shopItemId) => {
    const quantity = Number(orderForm.quantity) || 0;
    if (quantity < 1) {
      showToast("Quantity must be at least 1.", "error");
      return;
    }
    try {
      await api.post("/orders", {
        shopItem: shopItemId,
        quantity,
        size: orderForm.size,
        notes: orderForm.notes
      });
      showToast("Order placed successfully.");
      setOpenOrderId("");
      setOrderForm(defaultOrder);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to place order", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Ready-Made Shop</h1>
        <p className="mt-1 text-slate-600">Browse items uploaded by the designer and place your order in minutes.</p>
      </div>

      {loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="panel p-4">
              <div className="skeleton h-52 w-full" />
              <div className="mt-3 space-y-2">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="panel p-6 text-sm text-slate-600">No shop items available right now. Check back soon.</div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="panel card-hover overflow-hidden">
            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="h-72 w-full object-cover" />
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <span className="badge border-amber-200 bg-amber-50 text-amber-700">${item.price}</span>
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>

              {user?.role === "customer" ? (
                <div className="space-y-3 pt-2">
                  <button onClick={() => setOpenOrderId((prev) => (prev === item._id ? "" : item._id))} className="btn-primary w-full">Order This Item</button>
                  {openOrderId === item._id && (
                    <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                      <input className="field" placeholder="Size (e.g. M, L)" value={orderForm.size} onChange={(e) => setOrderForm((p) => ({ ...p, size: e.target.value }))} />
                      <input className="field" type="number" min="1" value={orderForm.quantity} onChange={(e) => setOrderForm((p) => ({ ...p, quantity: e.target.value }))} />
                      <textarea className="field" placeholder="Extra note (optional)" value={orderForm.notes} onChange={(e) => setOrderForm((p) => ({ ...p, notes: e.target.value }))} />
                      <button onClick={() => placeOrder(item._id)} className="btn-primary w-full">Confirm Order</button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">Login as customer to place a shop order.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
