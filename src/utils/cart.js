const CART_KEY = "nanbell_cart";

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
};

export const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addItemToCart = (item) => {
  const cart = getCart();
  const existing = cart.find((entry) => entry.shopItemId === item.shopItemId && entry.size === item.size && entry.notes === item.notes);
  if (existing) {
    existing.quantity += Number(item.quantity) || 1;
    saveCart(cart);
    return cart;
  }
  const next = [
    ...cart,
    {
      cartId: `${item.shopItemId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      ...item
    }
  ];
  saveCart(next);
  return next;
};

export const updateCartItem = (cartId, updates) => {
  const next = getCart().map((entry) => (entry.cartId === cartId ? { ...entry, ...updates } : entry));
  saveCart(next);
  return next;
};

export const removeCartItem = (cartId) => {
  const next = getCart().filter((entry) => entry.cartId !== cartId);
  saveCart(next);
  return next;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};
