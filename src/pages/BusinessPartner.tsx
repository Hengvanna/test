import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Award, Users, Globe, Check } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: TrendingUp,
    title: "Growing Market",
    desc: "Electric actuator market is projected to grow 8.5% annually as industries shift from pneumatic to electric automation.",
  },
  {
    icon: Award,
    title: "Premium Products",
    desc: "High-quality, competitively priced products backed by 30+ years of manufacturing expertise and ISO certifications.",
  },
  {
    icon: Users,
    title: "Training & Support",
    desc: "Comprehensive technical training, marketing materials, and dedicated partner manager for your market.",
  },
  {
    icon: Globe,
    title: "Exclusive Territory",
    desc: "Protected territory rights with clear market boundaries to maximize your investment and growth potential.",
  },
];

const programs = [
  {
    name: "Authorized Distributor",
    desc: "Full product line distribution with inventory support, technical training, and regional marketing assistance.",
    benefits: [
      "Exclusive territory rights",
      "Volume pricing",
      "Demo equipment",
      "Technical certification",
      "Co-marketing support",
    ],
  },
  {
    name: "System Integrator",
    desc: "Partner with HSF to integrate electric actuators into complete automation solutions for end customers.",
    benefits: [
      "Project pricing support",
      "Engineering collaboration",
      "Priority tech support",
      "Joint project bidding",
      "Solution certification",
    ],
  },
  {
    name: "OEM Partner",
    desc: "Incorporate HSF actuators into your machinery and equipment with custom branding and specification options.",
    benefits: [
      "Custom specifications",
      "Private labeling options",
      "Long-term pricing",
      "Design-in support",
      "Dedicated engineering contact",
    ],
  },
];

const regions = [
  { name: "North America", count: "12+", countries: "USA, Canada, Mexico" },
  { name: "Europe", count: "18+", countries: "Germany, UK, France, Italy, Netherlands, Spain" },
  { name: "Asia Pacific", count: "25+", countries: "Japan, South Korea, India, Thailand, Vietnam" },
  { name: "Rest of World", count: "8+", countries: "Brazil, Turkey, Australia, South Africa" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const BusinessPartner = () => (
  <div className="min-h-screen bg-background">

    {/* Hero */}
    <div className="py-20 px-6 text-center" style={{ backgroundColor: "hsl(var(--toyo-dark))" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Business Partner Program</h1>
        <p className="text-base" style={{ color: "hsl(var(--toyo-gray))" }}>
          Join HSF's global partner network and grow your business with industry-leading electric actuator solutions.
        </p>
      </div>
    </div>

    {/* Grow Together section */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid md:grid-cols-2">
          {/* Left content */}
          <div className="p-10 flex flex-col justify-center">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest border px-3 py-1 rounded-full mb-6 w-fit"
              style={{ color: "hsl(var(--toyo-red))", borderColor: "hsl(var(--toyo-red) / 0.3)", backgroundColor: "hsl(var(--toyo-red) / 0.05)" }}
            >
              Partner With Us
            </span>
            <h2 className="text-3xl font-black mb-4" style={{ color: "hsl(var(--toyo-dark))" }}>
              Grow Together with HSF
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "hsl(var(--toyo-gray))" }}>
              We are actively seeking qualified distributors, system integrators, and OEM partners worldwide.
              Join our network of 60+ partners serving customers across 50+ countries.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#apply"
                className="flex items-center gap-2 px-6 py-3 font-bold text-sm text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "hsl(var(--toyo-red))" }}
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                style={{ color: "hsl(var(--toyo-dark))" }}
              >
                Contact Sales
              </Link>
            </div>
          </div>
          {/* Right image */}
          <div className="min-h-64 md:min-h-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&auto=format&fit=crop&q=80"
              alt="Business partnership handshake"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 px-6" style={{ backgroundColor: "hsl(var(--toyo-light-gray))" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--toyo-red))" }}>Benefits</span>
          <h2 className="text-3xl font-black mt-2" style={{ color: "hsl(var(--toyo-dark))" }}>Why Partner with HSF?</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="bg-white rounded-2xl border border-gray-100 p-7 text-center hover:shadow-md transition-shadow">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: "hsl(var(--toyo-red) / 0.08)" }}
                >
                  <Icon className="w-6 h-6" style={{ color: "hsl(var(--toyo-red))" }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "hsl(var(--toyo-dark))" }}>{b.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--toyo-gray))" }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Programs */}
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--toyo-red))" }}>Programs</span>
          <h2 className="text-3xl font-black mt-2" style={{ color: "hsl(var(--toyo-dark))" }}>Partnership Programs</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-8 hover:shadow-lg transition-shadow ${i === 0 ? "border-red-200" : "border-gray-100"}`}
              style={i === 0 ? { backgroundColor: "hsl(var(--toyo-red) / 0.02)" } : {}}
            >
              <div
                className="w-8 h-8 rounded-full mb-5"
                style={{ backgroundColor: "hsl(var(--toyo-red))" }}
              />
              <h3 className="text-xl font-black mb-3" style={{ color: "hsl(var(--toyo-dark))" }}>{p.name}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--toyo-gray))" }}>{p.desc}</p>
              <ul className="space-y-2.5">
                {p.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2.5 text-sm" style={{ color: "hsl(var(--toyo-dark))" }}>
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--toyo-red))" }} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Global Network */}
    <section className="py-16 px-6" style={{ backgroundColor: "hsl(var(--toyo-dark))" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--toyo-red))" }}>Global Network</span>
          <h2 className="text-3xl font-black mt-2 text-white">Our Partner Network</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {regions.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border p-7"
              style={{ borderColor: "hsl(var(--toyo-gray) / 0.2)", backgroundColor: "hsl(var(--toyo-darker))" }}
            >
              <div className="text-4xl font-black text-white mb-1">{r.count}</div>
              <div className="text-sm font-semibold mb-3" style={{ color: "hsl(var(--toyo-red))" }}>Partners</div>
              <div className="font-bold text-white text-sm mb-2">{r.name}</div>
              <div className="text-xs leading-relaxed" style={{ color: "hsl(var(--toyo-gray))" }}>{r.countries}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Apply Form */}
    <section id="apply" className="py-20 px-6" style={{ backgroundColor: "hsl(var(--toyo-light-gray))" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--toyo-red))" }}>Apply</span>
          <h2 className="text-3xl font-black mt-2 mb-3" style={{ color: "hsl(var(--toyo-dark))" }}>Partner Application</h2>
          <p className="text-sm" style={{ color: "hsl(var(--toyo-gray))" }}>
            Fill out the form and our team will contact you within 3 business days.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--toyo-dark))" }}>
                  Company Name <span style={{ color: "hsl(var(--toyo-red))" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Company"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ color: "hsl(var(--toyo-dark))" }}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--toyo-red))")}
                  onBlur={e => (e.target.style.borderColor = "")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--toyo-dark))" }}>
                  Contact Person <span style={{ color: "hsl(var(--toyo-red))" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ color: "hsl(var(--toyo-dark))" }}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--toyo-red))")}
                  onBlur={e => (e.target.style.borderColor = "")}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--toyo-dark))" }}>
                  Email <span style={{ color: "hsl(var(--toyo-red))" }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ color: "hsl(var(--toyo-dark))" }}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--toyo-red))")}
                  onBlur={e => (e.target.style.borderColor = "")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--toyo-dark))" }}>Phone</label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ color: "hsl(var(--toyo-dark))" }}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--toyo-red))")}
                  onBlur={e => (e.target.style.borderColor = "")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--toyo-dark))" }}>
                Country / Region <span style={{ color: "hsl(var(--toyo-red))" }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Germany"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ color: "hsl(var(--toyo-dark))" }}
                onFocus={e => (e.target.style.borderColor = "hsl(var(--toyo-red))")}
                onBlur={e => (e.target.style.borderColor = "")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--toyo-dark))" }}>
                Partnership Type <span style={{ color: "hsl(var(--toyo-red))" }}>*</span>
              </label>
              <select
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none bg-white transition-colors"
                style={{ color: "hsl(var(--toyo-dark))" }}
                onFocus={e => (e.target.style.borderColor = "hsl(var(--toyo-red))")}
                onBlur={e => (e.target.style.borderColor = "")}
              >
                <option value="">Select type</option>
                <option>Authorized Distributor</option>
                <option>System Integrator</option>
                <option>OEM Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "hsl(var(--toyo-dark))" }}>Message</label>
              <textarea
                rows={4}
                placeholder="Tell us about your business and target market..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none transition-colors"
                style={{ color: "hsl(var(--toyo-dark))" }}
                onFocus={e => (e.target.style.borderColor = "hsl(var(--toyo-red))")}
                onBlur={e => (e.target.style.borderColor = "")}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-sm text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "hsl(var(--toyo-red))" }}
            >
              Submit Application <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
);

export default BusinessPartner;
