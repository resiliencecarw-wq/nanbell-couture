const AboutPage = () => {
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
    </div>
  );
};

export default AboutPage;
