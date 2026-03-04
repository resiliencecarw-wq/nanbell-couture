import { useEffect, useState } from "react";
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

const ShopPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCart().length);
    api.get("/shop-items")
      .then(({ data }) => setItems(data.filter((i) => i.available)))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (item) => {
    addItemToCart({
      shopItemId: item._id,
      itemName: item.name,
      imageUrl: item.imageUrl,
      quantity: 1,
      size: "",
      notes: ""
    });
    setCartCount(getCart().length);
    showToast("Added to cart.");
  };

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h1 className="text-3xl font-bold">Ready-Made Shop</h1>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-slate-600">Add items to cart, then confirm from your cart page.</p>
          <button
            onClick={() => {
              if (!user) {
                showToast("Please login to view your cart.");
                navigate("/login");
                return;
              }
              navigate("/cart");
            }}
            className="btn-primary"
          >
            View Cart ({cartCount})
          </button>
        </div>
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
              <button onClick={() => addToCart(item)} className="btn-primary mt-2 w-full">Add to Cart</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
