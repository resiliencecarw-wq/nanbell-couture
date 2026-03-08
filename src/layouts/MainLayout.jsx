import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CART_KEY = "nanbell_cart";

const getCartCount = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
};

const navLinkClass = ({ isActive }) =>
  `relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive
    ? "bg-white text-[#b8322f] shadow-md ring-1 ring-[#f0d2c0]"
    : "text-slate-600 hover:bg-white/80 hover:text-[#b8322f] hover:shadow-sm"}`;

const mobileNavLinkClass = ({ isActive }) =>
  `rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
    ? "bg-[#fff2e8] text-[#b8322f] font-semibold"
    : "text-slate-600 hover:bg-[#fff7f2] hover:text-[#b8322f]"}`;

// Mobile Bottom Navigation Component
const MobileBottomNav = ({ cartCount }) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { path: "/templates", label: "Designs", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { path: "/shop", label: "Shop", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { path: "/cart", label: "Cart", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z", badge: cartCount },
    { path: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];
  
  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.path === "/cart") {
      // Show cart for customers only
      return true;
    }
    return true;
  });

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex items-center justify-around">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === "/cart" && location.pathname === "/cart");
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="relative">
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth={isActive ? 2 : 1.5}
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b8322f] text-[0.6rem] font-bold text-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[0.65rem]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    const handleStorage = () => setCartCount(getCartCount());
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(() => setCartCount(getCartCount()), 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-amber-100/50 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 rounded-2xl border border-amber-100 bg-white px-3 py-2 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50"
            >
              <span className="h-12 w-12 overflow-hidden rounded-full border-2 border-amber-50 bg-gradient-to-br from-amber-50 to-rose-50">
                <img
                  src="https://res.cloudinary.com/dseenib62/image/upload/v1772625961/logo_ejndhc.jpg"
                  alt="Nanbell Couture logo"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </span>
              <span className="leading-none">
                <span className="block text-[1.1rem] font-bold text-[#b8322f]">Nanbell</span>
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-amber-600">Couture</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-amber-100/60 bg-white/80 p-1.5 shadow-sm md:flex">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/templates" className={navLinkClass}>Designs</NavLink>
              <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
              {user?.role === "customer" && (
                <NavLink to="/cart" className={navLinkClass}>
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#b8322f] text-[0.65rem] font-bold text-white animate-pulse">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </NavLink>
              )}
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              {!user && <NavLink to="/login" className={navLinkClass}>Login</NavLink>}
              {!user && <NavLink to="/register" className={navLinkClass}>Register</NavLink>}
              {user?.role === "customer" && <NavLink to="/customer/dashboard" className={navLinkClass}>My Orders</NavLink>}
              {user?.role === "admin" && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
              {user && (
                <button 
                  onClick={logout} 
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  Logout
                </button>
              )}
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              {user?.role === "customer" && (
                <Link
                  to="/cart"
                  className="relative rounded-xl border border-amber-100 bg-white p-2.5 shadow-sm"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6h15l-1.5 9h-12z" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                    <path d="M6 6L5 3H2" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b8322f] text-[0.6rem] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="rounded-xl border border-amber-100 bg-white p-2.5 text-slate-700 shadow-sm transition-all duration-200 hover:shadow-md"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  {isMenuOpen ? (
                    <>
                      <path d="M6 6l12 12M6 18L18 6" />
                    </>
                  ) : (
                    <>
                      <path d="M3 6h18" />
                      <path d="M3 12h18" />
                      <path d="M3 18h18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <nav 
            className={`${
              isMenuOpen 
                ? "mt-3 flex opacity-100 translate-y-0" 
                : "mt-0 hidden opacity-0 -translate-y-2"
              } 
              absolute left-0 right-0 top-full flex-col gap-1 rounded-b-2xl border border-t-0 border-amber-100 bg-white/95 p-4 text-sm font-medium shadow-xl backdrop-blur-md transition-all duration-300 md:hidden`}
            style={{ position: 'fixed', top: '76px', left: 0, right: 0, zIndex: 40 }}
          >
            <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/templates" className={mobileNavLinkClass} onClick={closeMenu}>Designs</NavLink>
            <NavLink to="/shop" className={mobileNavLinkClass} onClick={closeMenu}>Shop</NavLink>
            {user?.role === "customer" && <NavLink to="/cart" className={mobileNavLinkClass} onClick={closeMenu}>Cart</NavLink>}
            <NavLink to="/about" className={mobileNavLinkClass} onClick={closeMenu}>About</NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass} onClick={closeMenu}>Contact</NavLink>
            <div className="my-2 border-t border-amber-100" />
            {!user && <NavLink to="/login" className={mobileNavLinkClass} onClick={closeMenu}>Login</NavLink>}
            {!user && <NavLink to="/register" className={mobileNavLinkClass} onClick={closeMenu}>Register</NavLink>}
            {user?.role === "customer" && <NavLink to="/customer/dashboard" className={mobileNavLinkClass} onClick={closeMenu}>My Orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin/dashboard" className={mobileNavLinkClass} onClick={closeMenu}>Admin</NavLink>}
            {user && (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="mt-1 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">{children}</main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={cartCount} />

      <footer className="mt-auto border-t border-amber-100/50 bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-xl font-bold text-[#b8322f]">
              <span className="h-8 w-8 overflow-hidden rounded-full border border-amber-100">
                <img
                  src="https://res.cloudinary.com/dseenib62/image/upload/v1772625961/logo_ejndhc.jpg"
                  alt="Nanbell Couture logo"
                  className="h-full w-full object-cover"
                />
              </span>
              Nanbell Couture
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Crafting elegance through custom designs and premium ready-made fashion. Your style, our passion.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="soft-link w-fit">Home</Link>
              <Link to="/shop" className="soft-link w-fit">Shop</Link>
              <Link to="/templates" className="soft-link w-fit">Designs</Link>
              <Link to="/about" className="soft-link w-fit">About Us</Link>
              <Link to="/contact" className="soft-link w-fit">Contact Us</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-slate-800">Get in Touch</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#b8322f]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.15 15.84l-1.72-.51c-.37-.11-.78-.03-1.07.22l-1.22 1.01c-2.15-1.05-3.93-2.83-4.98-4.98l1.01-1.22c.26-.31.34-.73.23-1.07l-.51-1.72A1.46 1.46 0 0011.67 5H9.5C8.67 5 8 5.67 8.08 6.5c.3 4.68 2.41 8.79 5.92 11.3 3.51 2.51 7.62 5.62 11.3 5.92.83.08 1.5-.59 1.5-1.42v-2.17c0-.61-.37-1.16-.95-1.29z"/>
                </svg>
                +233 54 111 4579
              </p>
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#b8322f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
                patiencekwegyina@gmail.com
              </p>
              <p className="flex items-start gap-2">
                <svg className="h-4 w-4 text-[#b8322f] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Takoradi, Ghana
              </p>
              <p className="flex items-center gap-2 text-green-600 font-medium">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
                Delivery nationwide
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-100/50 bg-amber-50/50 px-4 py-4 text-center text-xs font-medium text-slate-500">
          © {new Date().getFullYear()} Nanbell Couture. All rights reserved. Made with ❤️ in Ghana
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
