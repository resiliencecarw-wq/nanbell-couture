import { useState } from "react";

const ContactPage = () => {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-slate-600">Send us a message and we will get back to you shortly.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <form onSubmit={onSubmit} className="panel space-y-3 p-5">
          <input className="field" placeholder="Your name" required />
          <input className="field" type="email" placeholder="Your email" required />
          <input className="field" placeholder="Subject" required />
          <textarea className="field" rows="5" placeholder="Message" required />
          <button className="btn-primary">Send Message</button>
          {sent && <p className="text-sm text-[#0f8b6e]">Message sent successfully.</p>}
        </form>

        <div className="panel p-5">
          <h2 className="text-xl font-semibold">Reach Us Directly</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>Phone: +233 20 000 0000</p>
            <p>Email: hello@nanbellcouture.com</p>
            <p>Location: Accra, Ghana</p>
            <p>Hours: Mon - Sat, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
