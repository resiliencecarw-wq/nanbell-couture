import { useState } from "react";

const WHATSAPP_NUMBER = "233541114579";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const message = [
      "Hello Nanbell Couture,",
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Subject: ${form.subject}`,
      `Message: ${form.message}`
    ].join("\n");
    window.open(`${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-slate-600">Send us a message and it will be delivered directly to our WhatsApp.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <form onSubmit={onSubmit} className="panel space-y-3 p-5">
          <input className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          <input className="field" type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          <input className="field" placeholder="Subject" value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} required />
          <textarea className="field" rows="5" placeholder="Message" value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} required />
          <button className="btn-primary">Send Message</button>
          {sent && <p className="text-sm text-[#0f8b6e]">WhatsApp opened with your message. Send it there to complete contact.</p>}
        </form>

        <div className="panel p-5">
          <h2 className="text-xl font-semibold">Reach Us Directly</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>Phone: +233 54 111 4579</p>
            <p>
              WhatsApp:{" "}
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="font-semibold text-[#0f8b6e] hover:underline">
                Chat on WhatsApp
              </a>
            </p>
            <p>Email: hello@nanbellcouture.com</p>
            <p>Location: Takoradi, Ghana</p>
            <p>Delivery: Available to every part of Ghana</p>
            <p>Hours: Mon - Sat, 9:00 AM - 6:00 PM</p>
          </div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#b6e6d8] bg-[#ebfbf5] px-4 py-2 text-sm font-semibold text-[#0f8b6e]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M19.1 4.9A9.93 9.93 0 0 0 12.03 2C6.5 2 2 6.5 2 12.03c0 1.78.47 3.51 1.37 5.03L2 22l5.09-1.34a10 10 0 0 0 4.94 1.27h.01c5.53 0 10.03-4.5 10.03-10.03a9.95 9.95 0 0 0-2.97-7zm-7.07 15.2h-.01a8.3 8.3 0 0 1-4.24-1.17l-.3-.18-3.02.79.81-2.94-.2-.31a8.28 8.28 0 0 1-1.28-4.39c0-4.58 3.73-8.31 8.31-8.31a8.26 8.26 0 0 1 5.88 2.44 8.24 8.24 0 0 1 2.43 5.88c0 4.58-3.73 8.31-8.38 8.31zm4.56-6.2c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.25a7.43 7.43 0 0 1-1.39-1.73c-.15-.25-.02-.38.11-.5.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.44.06-.67.31s-.88.86-.88 2.1.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.06.42 1.42.54.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29z" />
            </svg>
            Message us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
