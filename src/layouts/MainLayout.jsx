import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) => `rounded-lg px-3 py-1.5 transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-white hover:text-brand-700"}`;

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-[#f9f3eb]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-amber-200/80 bg-white/90 px-3 py-1.5 text-xl font-bold text-brand-700 shadow-sm">
            <span className="text-sm">NC</span>
            <span>Nanbell Couture</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
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
              <p>Phone: +233 20 000 0000</p>
              <p>Email: hello@nanbellcouture.com</p>
              <p>Address: Accra, Ghana</p>
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
