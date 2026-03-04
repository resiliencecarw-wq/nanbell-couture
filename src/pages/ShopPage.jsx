import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveImageUrl } from "../utils/image";

const defaultItemForm = { size: "", quantity: 1, notes: "" };

const ShopPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemForms, setItemForms] = useState({});
  const [cart, setCart] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    api.get("/shop-items")
      .then(({ data }) => setItems(data.filter((i) => i.available)))
      .finally(() => setLoading(false));
  }, []);

  const setItemFormValue = (shopItemId, key, value) => {
    setItemForms((prev) => ({
      ...prev,
      [shopItemId]: { ...(prev[shopItemId] || defaultItemForm), [key]: value }
    }));
  };

  const getItemForm = (shopItemId) => itemForms[shopItemId] || defaultItemForm;

  const addToCart = (item) => {
    const form = getItemForm(item._id);
    const quantity = Number(form.quantity) || 0;
    if (quantity < 1) {
      showToast("Quantity must be at least 1.", "error");
      return;
    }

    const existing = cart.find((entry) => entry.shopItemId === item._id && entry.size === form.size && entry.notes === form.notes);
    if (existing) {
      setCart((prev) =>
        prev.map((entry) =>
          entry === existing
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          cartId: `${item._id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          shopItemId: item._id,
          itemName: item.name,
          imageUrl: item.imageUrl,
          quantity,
          size: form.size,
          notes: form.notes
        }
      ]);
    }

    setItemForms((prev) => ({ ...prev, [item._id]: defaultItemForm }));
    showToast("Added to cart.");
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((entry) => entry.cartId !== cartId));
  };

  const checkoutCart = async () => {
    if (!user) {
      showToast("Please login to checkout.");
      navigate("/login");
      return;
    }
    if (user.role !== "customer") {
      showToast("Only customer accounts can place shop orders.", "error");
      return;
    }
    if (cart.length === 0) {
      showToast("Your cart is empty.", "error");
      return;
    }

    setCheckingOut(true);
    try {
      for (const entry of cart) {
        await api.post("/orders", {
          shopItem: entry.shopItemId,
          quantity: entry.quantity,
          size: entry.size,
          notes: entry.notes
        });
      }
      setCart([]);
      showToast("Order request sent. Awaiting admin confirmation.");
    } catch (err) {
      showToast(err.response?.data?.message || "Checkout failed", "error");
    } finally {
      setCheckingOut(false);
    }
  };

  const cartSummary = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Ready-Made Shop</h1>
        <p className="mt-1 text-slate-600">Add items to cart first, then confirm your checkout request.</p>
      </div>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Cart ({cartSummary} item{cartSummary === 1 ? "" : "s"})</h2>
          <button
            onClick={checkoutCart}
            disabled={checkingOut || cart.length === 0}
            className={`btn-primary ${checkingOut || cart.length === 0 ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {checkingOut ? "Confirming..." : "Confirm Cart Orders"}
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {cart.length === 0 && <p className="text-sm text-slate-600">Your cart is empty.</p>}
          {cart.map((entry) => (
            <div key={entry.cartId} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm">
              <img src={resolveImageUrl(entry.imageUrl)} alt={entry.itemName} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{entry.itemName}</p>
                <p className="text-slate-600">Qty: {entry.quantity} | Size: {entry.size || "-"}</p>
              </div>
              <button onClick={() => removeFromCart(entry.cartId)} className="rounded-lg border border-rose-200 px-2 py-1 text-rose-700">Remove</button>
            </div>
          ))}
        </div>
      </section>

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
              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                <input
                  className="field"
                  placeholder="Size (e.g. M, L)"
                  value={getItemForm(item._id).size}
                  onChange={(e) => setItemFormValue(item._id, "size", e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  min="1"
                  value={getItemForm(item._id).quantity}
                  onChange={(e) => setItemFormValue(item._id, "quantity", e.target.value)}
                />
                <textarea
                  className="field"
                  placeholder="Extra note (optional)"
                  value={getItemForm(item._id).notes}
                  onChange={(e) => setItemFormValue(item._id, "notes", e.target.value)}
                />
                <button onClick={() => addToCart(item)} className="btn-primary w-full">Add to Cart</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
