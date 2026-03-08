import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { resolveImageUrl } from "../utils/image";

const readFounderImages = (data) => {
  const list = Array.isArray(data?.founderImageUrls) ? data.founderImageUrls : [];
  if (list.length > 0) return list;
  if (data?.founderImageUrl) return [data.founderImageUrl];
  return [];
};

const AboutPage = () => {
  const [siteContent, setSiteContent] = useState({ 
    founderName: "", 
    founderBio: "", 
    founderImageUrls: [],
    aboutContent: ""
  });

  useEffect(() => {
    api.get("/site-content")
      .then(({ data }) =>
        setSiteContent({
          founderName: data.founderName || "",
          founderBio: data.founderBio || "",
          founderImageUrls: readFounderImages(data),
          aboutContent: data.aboutContent || ""
        })
      )
      .catch(() => {});
  }, []);

  const stats = [
    { value: "500+", label: "Designs Created", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { value: "1000+", label: "Happy Clients", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { value: "5+", label: "Years Experience", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { value: "Nationwide", label: "Delivery", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
  ];

  const values = [
    {
      title: "Quality First",
      description: "We never compromise on the quality of materials or craftsmanship. Every piece is made with precision.",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "amber"
    },
    {
      title: "Customer-Centric",
      description: "Your satisfaction is our priority. We listen to your needs and deliver beyond expectations.",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      color: "rose"
    },
    {
      title: "Timely Delivery",
      description: "We understand the importance of deadlines. Your orders are delivered on time, every time.",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "emerald"
    },
    {
      title: "Personalized Service",
      description: "Every client is unique. We offer bespoke solutions tailored to your individual style preferences.",
      icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
      color: "blue"
    }
  ];

  return (
    <div className="space-y-8 pb-nav">
      {/* Hero Section */}
      <section className="panel overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#b8322f]/10 via-amber-50/50 to-[#f2c35f]/10" />
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">
            About <span className="text-gradient">Nanbell Couture</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
            {siteContent.aboutContent || "We blend creativity and craftsmanship to deliver beautiful custom and ready-made outfits. Our platform helps clients explore designs, place orders, and track progress with ease."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="panel card-hover p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <svg className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={stat.icon} />
              </svg>
            </div>
            <p className="text-2xl font-bold text-[#b8322f]">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Mission, Promise, Style */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel card-hover p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <svg className="h-7 w-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Our Mission</h2>
          <p className="mt-2 text-sm text-slate-600">To make fashion ordering simple, transparent, and customer-friendly.</p>
        </article>
        <article className="panel card-hover p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <svg className="h-7 w-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Our Promise</h2>
          <p className="mt-2 text-sm text-slate-600">Quality tailoring, clear communication, and timely delivery.</p>
        </article>
        <article className="panel card-hover p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <svg className="h-7 w-7 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Our Style</h2>
          <p className="mt-2 text-sm text-slate-600">Elegant, bold, and modern designs tailored for every occasion.</p>
        </article>
      </section>

      {/* Our Values Section */}
      <section className="panel p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Core Values</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((value, idx) => (
            <div key={idx} className="flex gap-4 rounded-xl p-4 hover:bg-slate-50 transition-colors">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-${value.color}-50`}>
                <svg className={`h-6 w-6 text-${value.color}-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={value.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{value.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="panel overflow-hidden md:grid md:grid-cols-[1.1fr_1fr]">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#b8322f]">
            {siteContent.founderName || "The Face Behind Nanbell Couture"}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {siteContent.founderBio || "Meet the founder shaping every design with passion, precision, and timeless style. "}
            Our team is dedicated to bringing your fashion vision to life with meticulous attention to detail 
            and premium quality materials.
          </p>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#b8322f]">500+</p>
              <p className="text-xs text-slate-500">Designs Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#b8322f]">1000+</p>
              <p className="text-xs text-slate-500">Happy Clients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#b8322f]">5+</p>
              <p className="text-xs text-slate-500">Years Experience</p>
            </div>
          </div>
        </div>
        
        {/* Founder Images */}
        <div className="h-full min-h-64 bg-gradient-to-br from-amber-50/50 via-rose-50/50 to-orange-50/50 p-4">
          {siteContent.founderImageUrls.length > 0 ? (
            <div className="grid h-full min-h-56 gap-3 sm:grid-cols-2">
              {siteContent.founderImageUrls.map((url, idx) => (
                <div key={idx} className="img-hover-zoom rounded-xl overflow-hidden">
                  <img
                    src={resolveImageUrl(url)}
                    alt={`Founder ${idx + 1}`}
                    className="img-fit h-full min-h-40 w-full rounded-xl"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-200 bg-white/50 px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
              <p className="text-sm text-slate-500">Founder images will appear here after admin upload.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="panel overflow-hidden bg-gradient-to-r from-[#b8322f] via-[#d17353] to-[#f2c35f] p-8 md:p-12">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Ready to Work With Us?</h2>
            <p className="text-amber-100">
              Whether you're looking for custom designs or ready-made outfits, 
              we're here to bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link 
                to="/templates" 
                className="rounded-xl bg-white px-6 py-3 font-semibold text-[#b8322f] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                View Designs
              </Link>
              <Link 
                to="/contact" 
                className="rounded-xl border-2 border-white/60 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-white/10 animate-pulse" />
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

export default AboutPage;
