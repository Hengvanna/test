import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileDown, Download, Search, Mail, ChevronLeft, ChevronRight, Zap, Gauge, Leaf, Shield, Plug, Globe } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroBanner from "@/assets/hero-banner.jpg";
import carAssemblyLine from "@/assets/car-assembly-line.png";
import carFactoryProduction from "@/assets/car-factory-production.png";
import robotLine from "@/assets/robot-line.png";
import hsfProductsSmt from "@/assets/hsf-products-smt.png";
import hsfWarehouse from "@/assets/hsf-warehouse.png";
import heroLgwSeries from "@/assets/hero-lgw-series.png";
import heroNanoSystem from "@/assets/hero-nano-system.png";
import heroElectricGripper from "@/assets/hero-electric-gripper.png";
import productCpsg from "@/assets/product-cpsg.jpg";
import productGth from "@/assets/product-gth.jpg";
import productEhc from "@/assets/product-ehc.jpg";
import productRcs from "@/assets/product-rcs.jpg";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  event_type: string | null;
  published_at: string;
}

const heroSlides = [
 
  
    
    {
      img: hsfWarehouse,
      badge: "HSF",
      title: "Global Inventory",
      subtitle: "Organized Production & Storage",
      desc: "Well-stocked warehouse with linear actuators and industrial components ready for delivery",
      specs: ["Large inventory", "Organized storage", "Quick delivery"],
    },



{
    img: carAssemblyLine,
    badge: "Manufacturing",
    title: "SMT Production",
    subtitle: "Advanced Surface Mount Technology",
    desc: "High-precision cleanroom assembly for electronics and industrial components",
    specs: ["Automated assembly", "Clean room Class 1", "Precision placement"],
  },
  {
    img: carFactoryProduction,
    badge: "Smart Factory",
    title: "Systems Integrated",
    subtitle: "Automated Car Production",
    desc: "Isometric smart factory with data-optimized production and robotic assembly",
    specs: ["Data optimized", "Systems integrated", "Full automation"],
  },
  {
    img: robotLine,
    badge: "Automation",
    title: "Robotic Production",
    subtitle: "Precision Manufacturing Line",
    desc: "Advanced automated production with robotic arms and quality control stations",
    specs: ["Multi-axis robotics", "Final QC stations", "Vacuum technology"],
  },
  {
    img: hsfProductsSmt,
    badge: "HSF Products",
    title: "Linear Actuators & SMT",
    subtitle: "Precision Components & Manufacturing",
    desc: "HSF linear actuators and SMT machinery for precision industrial applications",
    specs: ["Linear actuators", "Pick-and-place", "Built-in control"],
  },
  
  // {
  //   img: heroLgwSeries,
  //   badge: "TAIWAN EXCELLENCE 2022",
  //   title: "LGW Series",
  //   subtitle: "Linear motor robot",
  //   desc: "Award-winning linear motor robot recognized for excellence in precision and performance.",
  //   specs: ["Award-winning design", "High precision performance", "Advanced automation technology"],
  // },
  // {
  //   img: heroNanoSystem,
  //   badge: "TAIWAN EXCELLENCE 2024",
  //   title: "HSF NANO SYSTEM",
  //   subtitle: "LBT series Air Bearing Stage · LXY series Alignment Stage",
  //   desc: "Precision stages with air bearing and alignment technology. Zero wear, zero maintenance, cleanroom Class 1.",
  //   specs: ["LBT: ±0.2µm/300mm accuracy, 0.5µm straightness, zero wear, no lubrication", "LXY: Embedded track 44mm, 0.1% speed ripple, Crossed-Roller Guide, ±0.25µm", "U-shaped & Rod-type linear motors"],
  // },
  // {
  //   img: heroElectricGripper,
  //   badge: "CHG2 / CHY / DHY",
  //   title: "ELECTRIC GRIPPER",
  //   subtitle: "Suitable for collaborative robots, six-axis robots",
  //   desc: "Highly versatile electric grippers with simple assembly, quick import, and easy programming via UI software.",
  //   specs: ["Simple Assembly — Including hardware and software", "Quick Import — Install and use in the least amount of time", "Easy To Program — Set and use with UI software"],
  // },
];

const quickLinks = [
  { icon: FileDown, label: "Catalogs", sub: "PDF", href: "/download?cat=catalogs" },
  { icon: Download, label: "Drawing", sub: "Downloads", href: "/download?cat=drawings" },
  { icon: Search, label: "Sizing", sub: "Software", href: "/technical" },
  { icon: Mail, label: "Contact", sub: "Us", href: "/contact" },
];

const productCards = [
  
  {
    img: productCpsg,
    badge: "Miniature Cylinder",
    series: "CPSG Series",
    desc: "Built-in Controller Type Precise Miniature Cylinder with high accuracy ±0.01mm",
    tags: ["High Accuracy", "600mm/s Speed", "Wiring Free"],
    href: "/products?cat=single-axis",
  },
  {
    img: productGth,
    badge: "Linear Actuator",
    series: "GTH Series",
    desc: "High Rigidity Linear Actuator ideal for heavy-duty precision applications",
    tags: ["200kg Load", "1500mm Stroke", "±0.01mm"],
    href: "/products?cat=multi-axis",
  },
  {
    img: productEhc,
    badge: "Electric Cylinder",
    series: "EHC Series",
    desc: "Compact Electric Cylinder for space-saving automation solutions",
    tags: ["Ultra-compact", "800mm/s", "Clean Room"],
    href: "/products?cat=servo-cylinders",
  },
  {
    img: productRcs,
    badge: "Cartesian Robot",
    series: "RCS Series",
    desc: "Robot Cartesian System for multi-axis precision positioning",
    tags: ["Multi-axis", "High Speed", "Modular Design"],
    href: "/products?cat=desktop",
  },
 
];

const stats = [
  { value: "30+", label: "Years Experience" },
  { value: "50+", label: "Countries Served" },
  { value: "1000+", label: "Product Models" },
  { value: "10K+", label: "Clients Worldwide" },
];

const whyChoose = [
  { icon: Gauge, title: "High Precision", desc: "Positioning accuracy of ±0.01mm with advanced servo control technology" },
  { icon: Zap, title: "High Speed", desc: "Maximum speed up to 600mm/s for faster cycle times and higher productivity" },
  { icon: Leaf, title: "Energy Saving", desc: "Up to 80% energy reduction compared to traditional pneumatic systems" },
  { icon: Shield, title: "Reliability", desc: "Built with premium materials ensuring long service life and minimal maintenance" },
  { icon: Plug, title: "Easy Integration", desc: "Built-in controllers with wiring-free design for simple plug-and-play installation" },
  { icon: Globe, title: "Global Support", desc: "Dedicated technical support teams across 50+ countries worldwide" },
];

const Index = () => {
  const [slide, setSlide] = useState(0);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [latestEvents, setLatestEvents] = useState<NewsItem[]>([]);
  const [latestAnnouncements, setLatestAnnouncements] = useState<NewsItem[]>([]);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Fetch latest 5 from each category in parallel
    Promise.all([
      (supabase as any).from("news_items").select("id, title, excerpt, category, event_type, published_at").eq("status","published").eq("category","news").order("published_at",{ascending:false}).limit(5),
      (supabase as any).from("news_items").select("id, title, excerpt, category, event_type, published_at").eq("status","published").eq("category","event").order("published_at",{ascending:false}).limit(5),
      (supabase as any).from("news_items").select("id, title, excerpt, category, event_type, published_at").eq("status","published").eq("category","announcement").order("published_at",{ascending:false}).limit(5),
    ]).then(([n, e, a]) => {
      setLatestNews(n.data || []);
      setLatestEvents(e.data || []);
      setLatestAnnouncements(a.data || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <section className="relative w-full h-[55vh] min-h-[420px] overflow-hidden">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
          >
            <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-12 left-12 max-w-lg text-white">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full uppercase tracking-widest">
                {s.badge}
              </span>
              <h2 className="text-4xl font-black mt-3 mb-1">{s.title}</h2>
              <p className="text-white/90 font-semibold text-lg mb-1">{s.subtitle}</p>
              <p className="text-white/70 text-sm mb-3">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.specs.map((spec) => (
                  <span key={spec} className="text-xs bg-white/15 border border-white/25 px-2.5 py-1 rounded">{spec}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Prev / Next */}
        <button
          onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === slide ? "bg-toyo-red" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Company intro */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Industry Leading Electric Actuator Manufacturer &gt; HSF Robot
        </h2>
        <p className="text-toyo-red text-sm max-w-xl mx-auto mb-2">
          The largest, aluminum extrusion, electro-mechanical, linear actuator manufacturer, in Taiwan and Mainland China.
        </p>
        <Link to="/about" className="text-toyo-red text-sm font-semibold hover:underline">
          About us.
        </Link>

        {/* Quick icon links */}
        <div className="mt-10 grid grid-cols-4 max-w-2xl mx-auto divide-x divide-gray-200 border-t border-b border-gray-200">
          {quickLinks.map(({ icon: Icon, label, sub, href }) => (
            <Link
              key={label}
              to={href}
              className="flex flex-col items-center gap-2 py-6 text-gray-600 hover:text-toyo-red group transition-colors"
            >
              <Icon className="w-7 h-7 text-toyo-red" strokeWidth={1.5} />
              <div className="text-center">
                <div className="font-semibold text-sm group-hover:text-toyo-red text-gray-800">{label}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-toyo-red text-xs font-bold uppercase tracking-widest mb-2">Our Products</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Electric Actuator Solutions</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Precision-engineered electric actuators designed to replace pneumatic cylinders<br />
              with superior performance and energy efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productCards.map((p) => (
              <Link
                key={p.series}
                to={p.href}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                <div className="relative">
                  <img src={p.img} alt={p.series} className="w-full h-44 object-cover" />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2.5 py-1 rounded">
                    {p.badge}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">{p.series}</h3>
                  <p className="text-gray-500 text-sm mb-3 leading-snug">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-toyo-red text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-toyo-dark py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.value}>
              <div className="text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-toyo-red text-xs font-bold uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">The HSF Advantage</h2>
            <p className="text-gray-500 text-sm">Leading innovation in electric actuator technology for over three decades.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 border border-gray-100 rounded-xl hover:border-toyo-red/30 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-toyo-red/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-toyo-red" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section — 2 columns like HSF */}
      {(latestEvents.length > 0 || latestAnnouncements.length > 0) && (
        <section className="py-16 px-6 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-toyo-red text-xs font-bold uppercase tracking-widest mb-2">Latest Updates</p>
              <h2 className="text-2xl font-bold text-gray-900">News & Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Events */}
              {latestEvents.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                    <h3 className="font-bold text-gray-800 text-sm">Event News</h3>
                    <Link to="/news/event" className="text-toyo-red text-xs hover:underline flex items-center gap-1">
                      More <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <ul className="space-y-3">
                    {latestEvents.map(item => (
                      <li key={item.id} className="flex gap-3 hover:bg-white -mx-2 px-2 py-2 transition-colors cursor-pointer">
                        <div className="text-center w-12 flex-shrink-0">
                          <div className="text-toyo-red font-black text-lg leading-none">
                            {new Date(item.published_at).getDate().toString().padStart(2,"0")}
                          </div>
                          <div className="text-gray-400 text-[10px]">
                            {new Date(item.published_at).toLocaleString("en",{month:"short",year:"numeric"})}
                          </div>
                        </div>
                        <div>
                          <span className="text-toyo-red text-[10px] font-bold uppercase">{item.event_type || "Event"}</span>
                          <p className="text-sm font-medium text-gray-800 leading-snug">{item.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Announcements */}
              {latestAnnouncements.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                    <h3 className="font-bold text-gray-800 text-sm">Company Announcements</h3>
                    <Link to="/news/announcements" className="text-toyo-red text-xs hover:underline flex items-center gap-1">
                      More <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <ul className="space-y-3">
                    {latestAnnouncements.map(item => (
                      <li key={item.id} className="flex gap-3 hover:bg-white -mx-2 px-2 py-2 transition-colors cursor-pointer">
                        <div className="text-center w-12 flex-shrink-0">
                          <div className="text-toyo-red font-black text-lg leading-none">
                            {new Date(item.published_at).getDate().toString().padStart(2,"0")}
                          </div>
                          <div className="text-gray-400 text-[10px]">
                            {new Date(item.published_at).toLocaleString("en",{month:"short",year:"numeric"})}
                          </div>
                        </div>
                        <div>
                          <span className="text-toyo-red text-[10px] font-bold uppercase">{item.event_type || "Announcement"}</span>
                          <p className="text-sm font-medium text-gray-800 leading-snug">{item.title}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Index;

