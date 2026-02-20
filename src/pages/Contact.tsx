import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Get In Touch</p>
          <h1 className="text-4xl font-black text-white">Contact Us</h1>
        </div>
      </div>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-black text-toyo-dark mb-6">TOYO Electric Corporation</h2>
            <div className="space-y-4 mb-8">
              {[
                { icon: MapPin, label: "Headquarters", value: "No. 10, Gongye 2nd Rd., Xinshi Dist., Tainan City 744, Taiwan" },
                { icon: Phone, label: "Phone", value: "+886-6-505-5000" },
                { icon: Mail, label: "Email", value: "info@toyo.com.tw" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-toyo-red/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-toyo-red" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-toyo-gray uppercase tracking-wide">{label}</p>
                    <p className="text-toyo-dark text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-l-4 border-toyo-red pl-4 bg-toyo-light-gray p-4">
              <p className="text-sm font-semibold text-toyo-dark mb-1">Business Hours</p>
              <p className="text-toyo-gray text-xs">Monday – Friday: 08:30 – 17:30 (GMT+8)</p>
              <p className="text-toyo-gray text-xs">Saturday – Sunday: Closed</p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-black text-toyo-dark mb-6">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "John Smith" },
                { name: "email", label: "Email Address", type: "email", placeholder: "john@company.com" },
                { name: "company", label: "Company", type: "text", placeholder: "Your Company Name" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-toyo-dark mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-toyo-red"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-toyo-dark mb-1">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your application or inquiry..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-toyo-red resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-toyo-red text-white py-3 font-bold hover:bg-toyo-red-dark transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
