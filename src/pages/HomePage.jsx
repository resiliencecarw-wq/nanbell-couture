import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { resolveImageUrl } from "../utils/image";

const formatPrice = (price) => `₵${Number(price).toFixed(2)}`;

const HomePage = () => {
  const heroImage = "https://designer-rouge-ten.vercel.app/hero.png";
  const [templates, setTemplates] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/templates"), api.get("/shop-items")])
      .then(([t, s]) => {
        setTemplates(t.data.slice(0, 3));
        setShopItems(s.data.filter((i) => i.available).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      {/* Enhanced Hero Section */}
      <section
        className="relative overflow-hidden rounded-[2rem] shadow-2xl"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a120f]/90 via-[#4a1a15]/70 to-[#8B4513]/40" />
        
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full border border-white/5 bg-white/5" />
        <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full border border-amber-300/20" />
        
        <div className="hero-content relative px-8 py-16 md:px-12 md:py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="reveal-up mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
              Welcome to
            </p>
            <h1 className="reveal-up delay-1 mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Nanbell Couture
            </h1>
            <p className="reveal-up delay-2 mb-6 max-w-xl text-base leading-relaxed text-amber-100 md:text-lg">
              Discover exquisite custom designs and shop premium ready-made outfits. 
              Track your orders seamlessly from creation to pickup.
            </p>
            <div className="reveal-up delay-3 flex flex-wrap gap-4">
              <Link 
                to="/shop" 
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#b8322f] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Explore Shop
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link 
                to="/templates" 
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/60 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:-translate-y-1"
              >
                View Designs
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2a120f]/50 to-transparent" />
      </section>

      {/* Design Templates Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Design Templates</h2>
            <p className="mt-1 text-slate-600">Browse our collection of custom design inspirations</p>
          </div>
          <Link to="/templates" className="soft-link hidden sm:flex items-center gap-1">
            See all 
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="panel p-4">
                <div className="skeleton h-64 w-full rounded-xl" />
                <div className="mt-4 space-y-2">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : templates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 stagger-children">
            {templates.map((item) => (
              <article key={item._id} className="panel card-hover group overflow-hidden flex flex-col">
                <div className="relative h-80 w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50/50 to-orange-50/50 p-3 flex items-center justify-center">
                  <img 
                    src={resolveImageUrl(item.imageUrl)} 
                    alt={item.name} 
                    className="img-fit max-h-full max-w-full rounded-lg" 
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                  <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel p-8 text-center">
            <p className="text-slate-500">No templates available yet.</p>
          </div>
        )}
        
        <div className="text-center sm:hidden">
          <Link to="/templates" className="btn-secondary inline-flex items-center gap-2">
            View All Designs
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Shop Highlights Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Shop Highlights</h2>
            <p className="mt-1 text-slate-600">Premium ready-made outfits available now</p>
          </div>
          <Link to="/shop" className="soft-link hidden sm:flex items-center gap-1">
            Open shop 
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="panel p-4">
                <div className="skeleton h-64 w-full rounded-xl" />
                <div className="mt-4 space-y-2">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : shopItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 stagger-children">
            {shopItems.map((item) => (
              <article key={item._id} className="panel card-hover group overflow-hidden flex flex-col">
                <div className="relative h-80 w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50/50 to-orange-50/50 p-3 flex items-center justify-center">
                  <img 
                    src={resolveImageUrl(item.imageUrl)} 
                    alt={item.name} 
                    className="img-fit max-h-full max-w-full rounded-lg" 
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-[#b8322f] shadow-md backdrop-blur-sm">
                    {formatPrice(item.price)}
                  </div>
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                  <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel p-8 text-center">
            <p className="text-slate-500">No shop items available right now. Check back soon!</p>
          </div>
        )}
        
        <div className="text-center sm:hidden">
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Browse Shop
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Features/CTA Section */}
      <section className="panel overflow-hidden bg-gradient-to-r from-[#b8322f] via-[#d17353] to-[#f2c35f] p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Ready to Start Your Fashion Journey?</h2>
            <p className="text-amber-100">
              Create an account to track your orders, save your favorite designs, 
              and enjoy a personalized shopping experience.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link 
                to="/register" 
                className="rounded-xl bg-white px-6 py-3 font-semibold text-[#b8322f] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                Create Account
              </Link>
              <Link 
                to="/contact" 
                className="rounded-xl border-2 border-white/60 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-white/10" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/20 p-4 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-amber-100">Designs Created</p>
                </div>
                <div className="rounded-2xl bg-white/20 p-4 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold text-white">1000+</p>
                  <p className="text-sm text-amber-100">Happy Customers</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-white/20 p-4 text-center backdrop-blur-sm">
                  <p className="text-3xl font-bold text-white">Nationwide</p>
                  <p className="text-sm text-amber-100">Delivery Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
