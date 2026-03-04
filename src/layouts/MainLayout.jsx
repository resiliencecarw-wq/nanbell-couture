import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3.5 py-2 text-sm font-semibold transition ${isActive
    ? "bg-white text-[#b8322f] shadow-sm ring-1 ring-[#f0d2c0]"
    : "text-slate-700 hover:bg-white/90 hover:text-[#b8322f]"}`;
const mobileNavLinkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive
    ? "bg-[#fff2e8] text-[#b8322f]"
    : "text-slate-700 hover:bg-[#fff7f2]"}`;

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[#f3dccd] bg-gradient-to-r from-[#fff4ea]/95 via-[#fff8f3]/95 to-[#fff1e2]/95 shadow-[0_4px_20px_rgba(120,60,40,0.06)] backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#f1d4bf] bg-white px-3 py-2 text-xl font-bold text-[#b8322f] shadow-sm transition hover:shadow"
            >
              <span className="grid h-8 w-8 place-content-center rounded-full bg-gradient-to-br from-[#b8322f] to-[#d17353] text-xs font-bold text-white">NC</span>
              <span className="leading-none">
                <span className="block text-[1rem]">Nanbell</span>
                <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#8a4a3b]">Couture</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1.5 rounded-full border border-[#f0d2c0] bg-[#fef6ef]/90 p-1.5 md:flex">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/templates" className={navLinkClass}>Designs</NavLink>
              <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              {!user && <NavLink to="/login" className={navLinkClass}>Login</NavLink>}
              {!user && <NavLink to="/register" className={navLinkClass}>Register</NavLink>}
              {user?.role === "customer" && <NavLink to="/customer/dashboard" className={navLinkClass}>My Orders</NavLink>}
              {user?.role === "admin" && <NavLink to="/admin/dashboard" className={navLinkClass}>Admin</NavLink>}
              {user && <button onClick={logout} className="btn-ghost px-3 py-1.5">Logout</button>}
            </nav>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-xl border border-[#e9cdb9] bg-white p-2.5 text-slate-700 shadow-sm md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            </button>
          </div>

          <nav className={`${isMenuOpen ? "mt-3 flex" : "hidden"} flex-col gap-1.5 rounded-2xl border border-[#ecd2bd] bg-white/95 p-3 text-sm font-medium shadow-lg md:hidden`}>
            <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/templates" className={mobileNavLinkClass} onClick={closeMenu}>Designs</NavLink>
            <NavLink to="/shop" className={mobileNavLinkClass} onClick={closeMenu}>Shop</NavLink>
            <NavLink to="/about" className={mobileNavLinkClass} onClick={closeMenu}>About</NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass} onClick={closeMenu}>Contact</NavLink>
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
                className="btn-ghost mt-1 text-left"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mt-8 border-t border-[#e8c9b4] bg-[#fff5ec]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold text-[#b8322f]">Nanbell Couture</h3>
            <p className="mt-2 text-sm text-slate-600">
              Custom design showcase and ready-made fashion shopping platform.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <Link to="/" className="soft-link">Home</Link>
              <Link to="/shop" className="soft-link">Shop</Link>
              <Link to="/templates" className="soft-link">Designs</Link>
              <Link to="/about" className="soft-link">About Us</Link>
              <Link to="/contact" className="soft-link">Contact Us</Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              <p>Phone: +233 54 111 4579</p>
              <p>Email: patiencekwegyina@gmail.com</p>
              <p>Address: Takoradi, Ghana</p>
              <p>Delivery: Nationwide across Ghana</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#f0dac9] px-4 py-3 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Nanbell Couture. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
