import { useState } from "react";

const WHATSAPP_NUMBER = "233541114579";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const FAQS = [
  {
    question: "How do I place an order?",
    answer: "Browse our shop, add items to your cart, and proceed to checkout. For custom designs, explore our templates and contact us with your preferences."
  },
  {
    question: "What is the delivery timeline?",
    answer: "Delivery times vary based on the complexity of your order. Typically, ready-made items ship within 3-5 business days. Custom orders take 7-14 days depending on design complexity."
  },
  {
    question: "Do you offer alterations?",
    answer: "Yes! We offer alteration services for all our ready-made items. Contact us to discuss your specific needs."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery for ready-made items in original condition. Custom orders are non-refundable once production begins."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is confirmed, you can track its progress through your customer dashboard. You'll receive updates at each stage from production to delivery."
  }
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-6 pb-nav">
      <div className="panel p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-800">Contact Us</h1>
        <p className="mt-1 text-slate-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Contact Form */}
          <form onSubmit={onSubmit} className="panel space-y-4 p-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Your Name</label>
              <input 
                className="field" 
                placeholder="Enter your full name" 
                value={form.name} 
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                className="field" 
                type="email" 
                placeholder="your@email.com" 
                value={form.email} 
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <input 
                className="field" 
                placeholder="What is this about?" 
                value={form.subject} 
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} 
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Message</label>
              <textarea 
                className="field min-h-[120px] resize-none" 
                placeholder="Tell us more about your inquiry..." 
                value={form.message} 
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} 
                required 
              />
            </div>
            
            <button className="btn-primary w-full py-3 btn-micro">
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
                Send Message
              </span>
            </button>
            
            {sent && (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200">
                <span className="font-semibold">✓ Message ready!</span> WhatsApp has opened with your message. Send it to complete contact.
              </div>
            )}
          </form>

          {/* Quick Contact Info */}
          <div className="panel p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.1 4.9A9.93 9.93 0 0 0 12.03 2C6.5 2 2 6.5 2 12.03c0 1.78.47 3.51 1.37 5.03L2 22l5.09-1.34a10 10 0 0 0 4.94 1.27h.01c5.53 0 10.03-4.5 10.03-10.03a9.95 9.95 0 0 0-2.97-7zm-7.07 15.2h-.01a8.3 8.3 0 0 1-4.24-1.17l-.3-.18-3.02.79.81-2.94-.2-.31a8.28 8.28 0 0 1-1.28-4.39c0-4.58 3.73-8.31 8.31-8.31a8.26 8.26 0 0 1 5.88 2.44 8.24 8.24 0 0 1 2.43 5.88c0 4.58-3.73 8.31-8.38 8.31z"/>
                </svg>
              </span>
              Quick Contact
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <svg className="h-5 w-5 text-[#b8322f]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.15 15.84l-1.72-.51c-.37-.11-.78-.03-1.07.22l-1.22 1.01c-2.15-1.05-3.93-2.83-4.98-4.98l1.01-1.22c.26-.31.34-.73.23-1.07l-.51-1.72A1.46 1.46 0 0011.67 5H9.5C8.67 5 8 5.67 8.08 6.5c.3 4.68 2.41 8.79 5.92 11.3 3.51 2.51 7.62 5.62 11.3 5.92.83.08 1.5-.59 1.5-1.42v-2.17c0-.61-.37-1.16-.95-1.29z"/>
                </svg>
                <span>+233 54 111 4579</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <svg className="h-5 w-5 text-[#b8322f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
                <span>patiencekwegyina@gmail.com</span>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <svg className="h-5 w-5 text-[#b8322f] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Takoradi Racecourse, Ghana</span>
              </div>
            </div>
            
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition-all duration-200 hover:bg-green-100 hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.1 4.9A9.93 9.93 0 0 0 12.03 2C6.5 2 2 6.5 2 12.03c0 1.78.47 3.51 1.37 5.03L2 22l5.09-1.34a10 10 0 0 0 4.94 1.27h.01c5.53 0 10.03-4.5 10.03-10.03a9.95 9.95 0 0 0-2.97-7zm-7.07 15.2h-.01a8.3 8.3 0 0 1-4.24-1.17l-.3-.18-3.02.79.81-2.94-.2-.31a8.28 8.28 0 0 1-1.28-4.39c0-4.58 3.73-8.31 8.31-8.31a8.26 8.26 0 0 1 5.88 2.44 8.24 8.24 0 0 1 2.43 5.88c0 4.58-3.73 8.31-8.38 8.31zm4.56-6.2c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.25a7.43 7.43 0 0 1-1.39-1.73c-.15-.25-.02-.38.11-.5.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.44.06-.67.31s-.88.86-.88 2.1.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.06.42 1.42.54.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Business Hours */}
          <div className="panel p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Business Hours</h2>
            <div className="space-y-3">
              {[
                { day: "Monday - Friday", time: "9:00 AM - 6:00 PM", open: true },
                { day: "Saturday", time: "9:00 AM - 4:00 PM", open: true },
                { day: "Sunday", time: "Closed", open: false }
              ].map((schedule, idx) => (
                <div key={idx} className={`flex items-center justify-between rounded-lg p-3 ${schedule.open ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${schedule.open ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="font-medium text-slate-700">{schedule.day}</span>
                  </div>
                  <span className={`text-sm ${schedule.open ? 'text-emerald-700' : 'text-slate-400'}`}>{schedule.time}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 rounded-xl bg-amber-50 p-3 border border-amber-100">
              <p className="flex items-center gap-2 text-sm font-medium text-amber-700">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" rx="2"/>
                  <path d="M16 8h2a2 2 0 012 2v9a2 2 0 01-2 2H7"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                Delivery Available Nationwide
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Google Map */}
          <div className="panel overflow-hidden">
            <div className="h-64 w-full bg-slate-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.6!2d-1.78!3d4.88!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNTInMDAuMCJTwrA0LjAwMC!5e0!3m2!1sen!2sgh!4v1234567890"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nanbell Couture Location"
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600">Find us at Takoradi Racecourse, Ghana. We're conveniently located and easy to find!</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="panel p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {FAQS.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="faq-question w-full text-left"
                  >
                    <span>{faq.question}</span>
                    <svg 
                      className={`h-5 w-5 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  <div 
                    className={`faq-answer overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-4' : 'max-h-0'}`}
                  >
                    <p className="text-sm text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
