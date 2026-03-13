import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveImageUrl } from "../utils/image";

const formatPrice = (price) => `₵${Number(price).toFixed(2)}`;

const CART_KEY = "nanbell_cart";
const SAVE_FOR_LATER_KEY = "nanbell_save_for_later";

const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
};

const getSavedForLater = () => {
  try {
    const raw = localStorage.getItem(SAVE_FOR_LATER_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const saveSavedForLater = (items) => {
  localStorage.setItem(SAVE_FOR_LATER_KEY, JSON.stringify(items));
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

const moveToSaved = (item) => {
  const saved = getSavedForLater();
  const exists = saved.find(s => s.shopItemId === item.shopItemId && s.size === item.size);
  if (!exists) {
    saveSavedForLater([...saved, item]);
  }
  removeCartItem(item.cartId);
};

const moveToCart = (item) => {
  const cart = getCart();
  const exists = cart.find(c => c.shopItemId === item.shopItemId && c.size === item.size);
  if (!exists) {
    addItemToCart(item);
  }
  const saved = getSavedForLater().filter(s => s.cartId !== item.cartId);
  saveSavedForLater(saved);
};

const addItemToCart = (item) => {
  const cart = getCart();
  const existing = cart.find((entry) => entry.shopItemId === item.shopItemId && entry.size === item.size && entry.notes === item.notes);
  if (existing) {
    existing.quantity += Number(item.quantity) || 1;
    saveCart(cart);
    return;
  }
  saveCart([
    ...cart,
    {
      cartId: `${item.shopItemId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      ...item
    }
  ]);
};

const CartPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());
  const [savedForLater, setSavedForLater] = useState(getSavedForLater());
  const [checkingOut, setCheckingOut] = useState(false);

  const updateItem = (cartId, key, value) => {
    const next = updateCartItem(cartId, { [key]: value });
    setCart(next);
  };

  const removeItem = (cartId) => {
    const next = removeCartItem(cartId);
    setCart(next);
    showToast("Item removed from cart");
  };

  const handleMoveToSaved = (item) => {
    moveToSaved(item);
    setCart(getCart());
    setSavedForLater(getSavedForLater());
    showToast("Moved to saved for later");
  };

  const handleMoveToCart = (item) => {
    moveToCart(item);
    setCart(getCart());
    setSavedForLater(getSavedForLater());
    showToast("Moved back to cart");
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
  
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + (price * quantity);
    }, 0);
  }, [cart]);

  const incrementQuantity = (cartId, currentQty) => {
    const newQty = (Number(currentQty) || 1) + 1;
    updateItem(cartId, "quantity", newQty);
  };

  const decrementQuantity = (cartId, currentQty) => {
    const newQty = (Number(currentQty) || 1) - 1;
    if (newQty < 1) return;
    updateItem(cartId, "quantity", newQty);
  };

  return (
    <div className="space-y-6 pb-nav">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">My Cart</h1>
        <p className="mt-1 text-slate-600">Review your selected shop items and confirm your order request.</p>
      </div>

      {cart.length > 0 && (
        <div className="panel p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <p className="font-semibold">Items in cart: {totalItems}</p>
              {subtotal > 0 && (
                <span className="text-lg font-bold text-[#b8322f]">
                  Subtotal: {formatPrice(subtotal)}
                </span>
              )}
            </div>
            <button
              onClick={checkout}
              disabled={checkingOut || cart.length === 0}
              className={`btn-primary ${checkingOut || cart.length === 0 ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {checkingOut ? "Confirming..." : "Confirm Orders"}
            </button>
          </div>
        </div>
      )}

      {cart.length === 0 && savedForLater.length === 0 && (
        <div className="panel p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <svg className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 3H2" />
            </svg>
          </div>
          <p className="text-slate-600 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary inline-flex">Continue Shopping</Link>
        </div>
      )}

      {/* Cart Items */}
      {cart.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Cart Items ({cart.length})</h2>
          {cart.map((entry) => (
            <article key={entry.cartId} className="panel p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <img src={resolveImageUrl(entry.imageUrl)} alt={entry.itemName} className="img-fit h-32 w-full rounded-xl md:w-40 object-cover" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-lg font-semibold">{entry.itemName}</p>
                    {entry.price && (
                      <span className="font-bold text-[#b8322f]">{formatPrice(Number(entry.price) * Number(entry.quantity))}</span>
                    )}
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">Qty:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => decrementQuantity(entry.cartId, entry.quantity)}
                        className="qty-btn"
                        disabled={Number(entry.quantity) <= 1}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14" />
                        </svg>
                      </button>
                      <input
                        className="field w-16 text-center"
                        type="number"
                        min="1"
                        value={entry.quantity}
                        onChange={(e) => updateItem(entry.cartId, "quantity", e.target.value)}
                      />
                      <button 
                        onClick={() => incrementQuantity(entry.cartId, entry.quantity)}
                        className="qty-btn"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      className="field"
                      placeholder="Size"
                      value={entry.size || ""}
                      onChange={(e) => updateItem(entry.cartId, "size", e.target.value)}
                    />
                    <button 
                      onClick={() => handleMoveToSaved(entry)} 
                      className="text-sm font-medium text-slate-500 hover:text-[#b8322f]"
                    >
                      Save for later
                    </button>
                  </div>
                  <textarea
                    className="field"
                    rows="2"
                    placeholder="Notes (optional)"
                    value={entry.notes || ""}
                    onChange={(e) => updateItem(entry.cartId, "notes", e.target.value)}
                  />
                  <button 
                    onClick={() => removeItem(entry.cartId)} 
                    className="w-full rounded-xl border border-rose-200 px-3 py-2 text-rose-700 hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
          
          {/* Subtotal Row */}
          <div className="panel p-4">
            <div className="subtotal-row">
              <span>Subtotal ({totalItems} items)</span>
              <span className="text-[#b8322f]">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Saved for Later */}
      {savedForLater.length > 0 && (
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Saved for Later ({savedForLater.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {savedForLater.map((item) => (
              <article key={item.cartId} className="panel p-3 flex gap-3">
                <img 
                  src={resolveImageUrl(item.imageUrl)} 
                  alt={item.itemName} 
                  className="img-fit h-20 w-20 rounded-lg object-cover" 
                />
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-sm">{item.itemName}</p>
                  {item.price && <p className="font-bold text-[#b8322f]">{formatPrice(item.price)}</p>}
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="text-sm font-medium text-[#b8322f] hover:underline"
                  >
                    Move to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
