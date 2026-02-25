import { MapPin, Globe, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const regions = [
  {
    name: "Asia Pacific",
    count: "25+",
    countries: ["Japan", "South Korea", "India", "Thailand", "Vietnam", "Singapore", "Malaysia", "Cambodia"],
    color: "bg-toyo-red",
    offices: [
      { name: "HSF Phnom Penh Office", city: "Phnom Penh, Cambodia", phone: "+855-12 555 947", email: "nakvsk@gmail.com" },
      { name: "HSF ROBOTICS Japan", city: "Tokyo, Japan", phone: "+81-3-XXXX-XXXX", email: "japan@hsf.com" },
      { name: "HSF ROBOTICS KOREA", city: "Seoul, South Korea", phone: "+82-2-XXXX-XXXX", email: "korea@hsf.com" },
      { name: "HSF ROBOTICS PRIVATE LIMITED INDIA", city: "Mumbai, India", phone: "+91-22-XXXX-XXXX", email: "india@hsf.com" },
    ],
  },
  {
    name: "North America",
    count: "12+",
    countries: ["USA", "Canada", "Mexico"],
    color: "bg-blue-600",
    offices: [
      { name: "HSF USA", city: "Los Angeles, CA", phone: "+1-XXX-XXX-XXXX", email: "usa@hsf.com" },
    ],
  },
  {
    name: "Europe",
    count: "18+",
    countries: ["Germany", "UK", "France", "Italy", "Netherlands", "Spain"],
    color: "bg-emerald-600",
    offices: [
      { name: "HSF Europe GmbH", city: "Frankfurt, Germany", phone: "+49-XX-XXXX-XXXX", email: "europe@hsf.com" },
    ],
  },
  {
    name: "Rest of World",
    count: "8+",
    countries: ["Brazil", "Turkey", "Australia", "South Africa"],
    color: "bg-amber-600",
    offices: [
      { name: "HSF Australia", city: "Sydney, Australia", phone: "+61-X-XXXX-XXXX", email: "australia@hsf.com" },
    ],
  },
];

const partners = [
  { name: "HSF ROBOTICS . Japan", country: "Japan", flag: "🇯🇵" },
  { name: "HSF Nano System Co., Ltd.", country: "Taiwan", flag: "🇹🇼" },
  { name: "ECON ROBOT INC.", country: "Taiwan", flag: "🇹🇼" },
  { name: "MSI Co., Ltd.", country: "Taiwan", flag: "🇹🇼" },
  { name: "HSF ROBOTICS KOREA", country: "South Korea", flag: "🇰🇷" },
  { name: "HSF ROBOTICS PRIVATE LIMITED INDIA", country: "India", flag: "🇮🇳" },
];

const GlobalLocations = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <div className="bg-toyo-dark py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">About HSF</p>
        <h1 className="text-4xl font-black text-white">Global Locations</h1>
        <p className="text-gray-400 mt-3 max-w-xl">
          Serving customers across 50+ countries with a network of trusted partners and regional offices worldwide.
        </p>
      </div>
    </div>

    {/* Stats bar */}
    <div className="bg-toyo-red py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
        {[
          { label: "Countries Served", value: "50+" },
          { label: "Global Partners", value: "63+" },
          { label: "Years of Global Presence", value: "30+" },
          { label: "Regional Offices", value: "8" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-3xl font-black">{stat.value}</div>
            <div className="text-white/80 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* World Map Placeholder + regions */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Global Network</p>
          <h2 className="text-3xl font-black text-toyo-dark">Our Partner Network</h2>
        </div>

        {/* Region Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {regions.map((region) => (
            <div key={region.name} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className={`${region.color} px-6 py-4`}>
                <div className="text-white font-black text-3xl">{region.count}</div>
                <div className="text-white/80 text-xs font-medium mt-0.5">Partners</div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-toyo-dark text-lg mb-3">{region.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {region.countries.map((c) => (
                    <span key={c} className="text-xs bg-gray-100 text-toyo-gray px-2 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Office Listings */}
        <div className="text-center mb-10">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Offices</p>
          <h2 className="text-3xl font-black text-toyo-dark">Regional Offices & Partners</h2>
        </div>

        <div className="space-y-4">
          {regions.map((region) =>
            region.offices.map((office) => (
              <div
                key={office.name}
                className="flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-xl p-6 hover:border-toyo-red/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-toyo-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-toyo-red" />
                  </div>
                  <div>
                    <div className="font-bold text-toyo-dark">{office.name}</div>
                    <div className="text-toyo-gray text-sm">{office.city}</div>
                    <div className="text-xs text-toyo-red font-medium mt-1">{region.name}</div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-1 text-sm text-toyo-gray">
                  <a href={`tel:${office.phone}`} className="flex items-center gap-1.5 hover:text-toyo-red transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {office.phone}
                  </a>
                  <a href={`mailto:${office.email}`} className="flex items-center gap-1.5 hover:text-toyo-red transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {office.email}
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>

    {/* Authorized Partners */}
    <section className="py-16 px-6 bg-toyo-light-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Partners</p>
          <h2 className="text-3xl font-black text-toyo-dark">Authorized Partners</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {partners.map((p) => (
            <Link
              key={p.name}
              to="/business-partner"
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-toyo-red/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.flag}</span>
                <div>
                  <div className="font-semibold text-toyo-dark text-sm leading-snug group-hover:text-toyo-red transition-colors">
                    {p.name}
                  </div>
                  <div className="text-xs text-toyo-gray mt-0.5">{p.country}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-toyo-red transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* HQ Info */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Headquarters</p>
          <h2 className="text-3xl font-black text-toyo-dark mb-4">HSF Electric Corporation</h2>
          <div className="space-y-3 text-toyo-gray">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-toyo-red mt-1 flex-shrink-0" />
              <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-toyo-red flex-shrink-0" />
              <a href="tel:+855-12555947" className="hover:text-toyo-red transition-colors">+855-12 555 947</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-toyo-red flex-shrink-0" />
              <a href="mailto:nakvsk@gmail.com" className="hover:text-toyo-red transition-colors">
                nakvsk@gmail.com
              </a>
            </div>
            <div className="border-l-4 border-toyo-red pl-4 bg-toyo-light-gray p-4 mt-4 rounded-r">
              <p className="text-sm font-semibold text-toyo-dark mb-1">Business Hours</p>
              <p className="text-toyo-gray text-xs">Monday – Friday: 08:30 – 17:30 (GMT+8)</p>
              <p className="text-toyo-gray text-xs">Saturday – Sunday: Closed</p>
            </div>
          </div>
        </div>
        <div className="bg-toyo-light-gray rounded-2xl p-8 text-center">
          <p className="text-toyo-gray mb-4">Interested in becoming a partner?</p>
          <Link
            to="/business-partner"
            className="inline-flex items-center gap-2 bg-toyo-red text-white px-6 py-3 font-bold rounded-lg hover:bg-toyo-red-dark transition-colors"
          >
            Become a Partner <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default GlobalLocations;
