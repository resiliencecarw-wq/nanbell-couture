import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { resolveImageUrl } from "../utils/image";

const HomePage = () => {
  const heroImage = "https://designer-rouge-ten.vercel.app/hero.png";
  const [templates, setTemplates] = useState([]);
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/templates"), api.get("/shop-items")]).then(([t, s]) => {
      setTemplates(t.data.slice(0, 3));
      setShopItems(s.data.filter((i) => i.available).slice(0, 3));
    });
  }, []);

  return (
    <div className="space-y-10">
      <section
        className="relative overflow-hidden rounded-3xl text-white shadow-xl"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center top"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a120f]/85 via-[#6f2a22]/65 to-[#b67600]/35" />
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/20" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative px-8 py-16 md:px-12 md:py-20">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-amber-100">Nanbell Couture Platform</p>
          <h1 className="max-w-3xl text-4xl leading-tight md:text-5xl">Elegant Design Showcase and Seamless Ready-Made Shopping</h1>
          <p className="mt-4 max-w-2xl text-sm text-amber-100 md:text-base">
            Discover design inspirations, buy ready-made outfits online, and track each order from creation to pickup.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="rounded-xl bg-white px-5 py-2 font-semibold text-[#b8322f]">Explore Shop</Link>
            <Link to="/templates" className="rounded-xl border border-white/60 bg-black/20 px-5 py-2 font-semibold text-white">View Designs</Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Design Templates</h2>
          <Link to="/templates" className="soft-link">See all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {templates.map((item) => (
            <article key={item._id} className="panel card-hover overflow-hidden">
              <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="h-64 w-full object-cover" />
              <div className="space-y-1 p-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Shop Highlights</h2>
          <Link to="/shop" className="soft-link">Open shop</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {shopItems.map((item) => (
            <article key={item._id} className="panel card-hover overflow-hidden">
              <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="h-64 w-full object-cover" />
              <div className="space-y-1 p-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                <p className="pt-1 text-lg font-semibold text-brand-700">${item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
