import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { resolveImageUrl } from "../utils/image";

const formatPrice = (price) => `₵${Number(price).toFixed(2)}`;

const CART_KEY = "nanbell_cart";
const WISHLIST_KEY = "nanbell_wishlist";

const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
};

const getWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const saveWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
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

const toggleWishlist = (itemId) => {
  const wishlist = getWishlist();
  const exists = wishlist.includes(itemId);
  if (exists) {
    saveWishlist(wishlist.filter(id => id !== itemId));
  } else {
    saveWishlist([...wishlist, itemId]);
  }
  return !exists;
};

const ShopPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setCartCount(getCart().length);
    setWishlist(getWishlist());
    
    const handleStorage = () => {
      setCartCount(getCart());
      setWishlist(getWishlist());
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(() => {
      setCartCount(getCart().length);
      setWishlist(getWishlist());
    }, 1000);
    
    api.get("/shop-items")
      .then(({ data }) => setItems(data.filter((i) => i.available)))
      .finally(() => setLoading(false));
      
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
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
    showToast("Added to cart!");
  };

  const handleWishlistToggle = (item) => {
    const isAdded = toggleWishlist(item._id);
    setWishlist(getWishlist());
    showToast(isAdded ? "Added to wishlist!" : "Removed from wishlist");
  };

  return (
    <div className="space-y-6 pb-nav">
      <div className="panel p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Ready-Made Shop</h1>
            <p className="mt-1 text-slate-600">Browse our collection of premium ready-made outfits</p>
          </div>
          <button
            onClick={() => {
              if (!user) {
                showToast("Please login to view your cart.");
                navigate("/login");
                return;
              }
              navigate("/cart");
            }}
            className="btn-primary relative inline-flex items-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 3H2" />
            </svg>
            View Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[0.7rem] font-bold text-[#b8322f]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="panel p-4">
              <div className="skeleton aspect-[4/5] w-full rounded-xl" />
              <div className="mt-4 space-y-2">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="panel p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <svg className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <p className="text-slate-600">No shop items available right now. Check back soon!</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="panel card-hover group overflow-hidden flex flex-col">
            {/* Image Container with Hover Zoom */}
            <div className="relative h-80 w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50/50 to-orange-50/50">
              <div className="img-hover-zoom h-full w-full p-3 flex items-center justify-center">
                <img 
                  src={resolveImageUrl(item.imageUrl)} 
                  alt={item.name} 
                  className="img-fit max-h-full max-w-full rounded-lg" 
                  loading="lazy"
                />
              </div>
              
              {/* Price Badge */}
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold text-[#b8322f] shadow-md backdrop-blur-sm">
                {formatPrice(item.price)}
              </div>
              
              {/* Wishlist Button */}
              <button 
                onClick={() => handleWishlistToggle(item)}
                className={`wishlist-btn ${wishlist.includes(item._id) ? 'text-rose-500' : ''}`}
                aria-label={wishlist.includes(item._id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill={wishlist.includes(item._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              
              {/* Sold Out Overlay */}
              {!item.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-t-lg">
                  <span className="rounded-full bg-slate-800 px-4 py-2 font-semibold text-white">Sold Out</span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="space-y-3 p-5">
              <h2 className="text-lg font-semibold text-slate-800">{item.name}</h2>
              <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
              <button 
                onClick={() => addToCart(item)} 
                disabled={!item.available}
                className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50 btn-micro"
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
