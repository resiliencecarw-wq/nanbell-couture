import { useEffect, useState } from "react";
import api from "../api/client";
import { resolveImageUrl } from "../utils/image";

const readFounderImages = (data) => {
  const list = Array.isArray(data?.founderImageUrls) ? data.founderImageUrls : [];
  if (list.length > 0) return list;
  if (data?.founderImageUrl) return [data.founderImageUrl];
  return [];
};

const AboutPage = () => {
  const [siteContent, setSiteContent] = useState({ founderName: "", founderBio: "", founderImageUrls: [] });

  useEffect(() => {
    api.get("/site-content")
      .then(({ data }) =>
        setSiteContent({
          founderName: data.founderName || "",
          founderBio: data.founderBio || "",
          founderImageUrls: readFounderImages(data)
        })
      )
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="mt-2 text-slate-600">
          Nanbell Couture blends creativity and craftsmanship to deliver beautiful custom and ready-made outfits.
          This platform helps clients explore designs, place orders, and track progress with ease.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-xl font-semibold">Our Mission</h2>
          <p className="mt-2 text-sm text-slate-600">To make fashion ordering simple, transparent, and customer-friendly.</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-xl font-semibold">Our Promise</h2>
          <p className="mt-2 text-sm text-slate-600">Quality tailoring, clear communication, and timely delivery.</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-xl font-semibold">Our Style</h2>
          <p className="mt-2 text-sm text-slate-600">Elegant, bold, and modern designs tailored for every occasion.</p>
        </article>
      </section>

      <section className="panel overflow-hidden md:grid md:grid-cols-[1.1fr_1fr]">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#b8322f]">
            {siteContent.founderName || "Face Behind Nanbell Couture"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {siteContent.founderBio || "Meet the founder shaping every design with passion, precision, and timeless style."}
          </p>
        </div>
        <div className="h-full min-h-64 bg-[#f8e5d9] p-4">
          {siteContent.founderImageUrls.length > 0 ? (
            <div className="grid h-full min-h-64 gap-2 sm:grid-cols-2">
              {siteContent.founderImageUrls.map((url) => (
                <img
                  key={url}
                  src={resolveImageUrl(url)}
                  alt="Founder of Nanbell Couture"
                  className="h-full min-h-32 w-full rounded-xl bg-[#f8f3ee] object-contain"
                />
              ))}
            </div>
          ) : (
            <div className="grid h-full min-h-64 place-content-center px-6 text-center text-sm text-slate-500">
              Founder images will appear here after admin upload.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
