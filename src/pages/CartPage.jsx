import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveImageUrl } from "../utils/image";

const CART_KEY = "nanbell_cart";

const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const updateCartItem = (cartId, updates) => {
  const next = getCart().map((entry) => (entry.cartId === cartId ? { ...entry, ...updates } : entry));
  saveCart(next);
  return next;
};

const removeCartItem = (cartId) => {
  const next = getCart().filter((entry) => entry.cartId !== cartId);
  saveCart(next);
  return next;
};

const clearCart = () => {
  saveCart([]);
  return [];
};

const CartPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());
  const [checkingOut, setCheckingOut] = useState(false);

  const updateItem = (cartId, key, value) => {
    const next = updateCartItem(cartId, { [key]: value });
    setCart(next);
  };

  const removeItem = (cartId) => {
    const next = removeCartItem(cartId);
    setCart(next);
  };

  const checkout = async () => {
    if (!user) {
      showToast("Please login to confirm your cart.");
      navigate("/login");
      return;
    }
    if (user.role !== "customer") {
      showToast("Only customer accounts can checkout.", "error");
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
          quantity: Number(entry.quantity) || 1,
          size: entry.size || "",
          notes: entry.notes || ""
        });
      }
      setCart(clearCart());
      showToast("Order request submitted. Admin confirmation is required.");
      navigate("/customer/dashboard");
    } catch (error) {
      showToast(error.response?.data?.message || "Checkout failed", "error");
    } finally {
      setCheckingOut(false);
    }
  };

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0), [cart]);

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">My Cart</h1>
        <p className="mt-1 text-slate-600">Review your selected shop items and confirm your order request.</p>
      </div>

      <div className="panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold">Items in cart: {totalItems}</p>
          <button
            onClick={checkout}
            disabled={checkingOut || cart.length === 0}
            className={`btn-primary ${checkingOut || cart.length === 0 ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {checkingOut ? "Confirming..." : "Confirm Orders"}
          </button>
        </div>
      </div>

      {cart.length === 0 && (
        <div className="panel p-6 text-sm text-slate-600">Your cart is empty. Add items from the shop.</div>
      )}

      <div className="grid gap-4">
        {cart.map((entry) => (
          <article key={entry.cartId} className="panel p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <img src={resolveImageUrl(entry.imageUrl)} alt={entry.itemName} className="h-28 w-full rounded-xl bg-[#f8f3ee] object-contain md:w-36" />
              <div className="flex-1 space-y-2">
                <p className="text-lg font-semibold">{entry.itemName}</p>
                <div className="grid gap-2 md:grid-cols-3">
                  <input
                    className="field"
                    type="number"
                    min="1"
                    value={entry.quantity}
                    onChange={(e) => updateItem(entry.cartId, "quantity", e.target.value)}
                  />
                  <input
                    className="field"
                    placeholder="Size"
                    value={entry.size || ""}
                    onChange={(e) => updateItem(entry.cartId, "size", e.target.value)}
                  />
                  <button onClick={() => removeItem(entry.cartId)} className="rounded-xl border border-rose-200 px-3 py-2 text-rose-700">
                    Remove
                  </button>
                </div>
                <textarea
                  className="field"
                  rows="2"
                  placeholder="Notes (optional)"
                  value={entry.notes || ""}
                  onChange={(e) => updateItem(entry.cartId, "notes", e.target.value)}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CartPage;
