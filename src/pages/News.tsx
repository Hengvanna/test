import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Latest news from TOYO Robot (https://www.toyorobot.com/News/Msg) - kept in sync manually */
const TOYO_ROBOT_NEWS_URL = "https://www.toyorobot.com/News/Msg";
const TOYO_EXTERNAL_NEWS: { title: string; date: string; excerpt: string; link?: string }[] = [
  {
    title: "TOYO Automation and Yamaha Motor Establish Joint Venture — TY ROBOTICS Co., Ltd.",
    date: "2025/11/18",
    excerpt: "Integrating production and sharing resources to strengthen industrial robot competitiveness. TY ROBOTICS Co., Ltd. was established in August 2025, scheduled to begin production in January 2026.",
    link: "https://global.yamaha-motor.com/news/2025/1014/ty.html",
  },
];

const tabs = [
  { label: "News", href: "/news" },
  { label: "Event News", href: "/news/event" },
  { label: "Company Announcements", href: "/news/announcements" },
];

/** Local campaign / product images (in public/images/news/) */
const FEATURED_IMAGES = [
  { src: "/images/news/ehc-series-compact-cylinder.png", alt: "EHC Series Compact Electric Cylinder", title: "EHC Series — Compact Electric Cylinder" },
  { src: "/images/news/strong-technical-service.png", alt: "STRONG Technical Service", title: "STRONG Technical Service" },
  { src: "/images/news/taiwan-excellence-2022-lgw.png", alt: "Taiwan Excellence 2022 — LGW Series Linear Motor Robot", title: "Taiwan Excellence 2022 — LGW Series" },
  { src: "/images/news/taiwan-excellence-2022.png", alt: "Taiwan Excellence 2022 Award", title: "Taiwan Excellence 2022" },
  { src: "/images/news/nano-system-lbt-lxy.png", alt: "TOYO NANO SYSTEM LBT and LXY Series", title: "NANO SYSTEM — LBT & LXY Series" },
  { src: "/images/news/cglth-cgltb-low-profile.png", alt: "CGLTH and CGLTB Series Low Profile Electric Cylinders", title: "CGLTH / CGLTB — Low Profile Electric Cylinders" },
  { src: "/images/news/gth-series-linear-actuator.png", alt: "GTH Series High Rigidity Linear Actuator", title: "GTH Series — High Rigidity Linear Actuator" },
];

function ToyoRobotNewsSection() {
  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-black text-gray-900">News from TOYO Robot</h2>
        <a
          href={TOYO_ROBOT_NEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-toyo-red hover:underline"
        >
          View all at toyorobot.com <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Latest updates from TOYO Robot — news, events, and company announcements.
      </p>
      <div className="space-y-6">
        {TOYO_EXTERNAL_NEWS.map((item, i) => (
          <article key={i} className="border border-gray-200 p-5 hover:border-toyo-red transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400 font-mono">News updated: {item.date}</span>
              <span className="border border-toyo-red text-toyo-red text-[10px] px-1.5 py-0.5 font-bold uppercase">News</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.excerpt}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-toyo-red hover:underline"
              >
                Read more <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  event_type: string | null;
  featured: boolean;
  published_at: string;
  image_url: string | null;
}

export const SubNav = () => (
  <div className="border-b border-gray-200 bg-white">
    <div className="max-w-7xl mx-auto px-6 flex gap-0">
      {tabs.map((tab) => (
        <NavLink
          key={tab.href}
          to={tab.href}
          end
          className={({ isActive }) =>
            `px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? "border-toyo-red text-toyo-red"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  </div>
);

const News = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (supabase as any)
      .from("news_items")
      .select("id, title, excerpt, content, category, event_type, featured, published_at, image_url")
      .eq("status", "published")
      .in("category", ["news"])
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .then(({ data }: { data: NewsItem[] | null }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  const featured = items.length > 0 ? items[0] : null;
  const rest = items.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Dark header banner */}
      <div className="bg-toyo-dark py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-white tracking-wide">Latest News</h1>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mt-3 text-sm">
            <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
            <span className="text-gray-500">&gt;</span>
            <span className="text-gray-400">Latest News</span>
            <span className="text-gray-500">&gt;</span>
            <span className="text-toyo-red font-semibold">News</span>
          </div>
        </div>
      </div>

      <SubNav />

      {/* Section title */}
      <section className="pt-10 pb-2 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-4">News</h2>
          <hr className="border-t-2 border-toyo-red" />
        </div>
      </section>

      {/* Featured campaigns / product images */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Featured campaigns & product highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURED_IMAGES.map((img, i) => (
              <div key={i} className="border border-gray-200 overflow-hidden bg-white hover:border-toyo-red transition-colors">
                <img
                  src={img.src}
                  alt={img.alt}
                  title={img.title}
                  className="w-full h-44 object-cover object-center"
                />
                <p className="p-3 text-sm font-medium text-gray-700 line-clamp-2">{img.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-6 py-6">
                  <div className="w-64 h-44 bg-gray-100 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12">
              <div className="py-8 text-center text-gray-400 text-sm">No local news available yet.</div>
              {/* Show TOYO Robot news even when no local news */}
              <ToyoRobotNewsSection />
            </div>
          ) : (
            <>
              {/* Featured / Latest article */}
              {featured && (
                <div className="mb-10">
                  {/* Tag + Date row */}
                  <div className="flex items-center justify-end gap-3 mb-4">
                    <span className="border border-toyo-red text-toyo-red text-xs px-3 py-1 font-bold uppercase tracking-wide">
                      {featured.event_type || "News Bulletin"}
                    </span>
                    <span className="text-sm text-gray-500">
                      Published: {new Date(featured.published_at).toLocaleDateString("en", { year: "numeric", month: "2-digit", day: "2-digit" })}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Image */}
                    {featured.image_url && (
                      <div className="w-full md:w-96 flex-shrink-0">
                        <img
                          src={featured.image_url}
                          alt={featured.title}
                          className="w-full h-auto object-cover border border-gray-200"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-4 leading-snug">{featured.title}</h3>
                      {featured.excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{featured.excerpt}</p>
                      )}
                      {featured.content && (
                        <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-line line-clamp-[12]">
                          {featured.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Older news items as card list */}
              {rest.length > 0 && (
                <>
                  <hr className="border-gray-200 mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {rest.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 hover:border-toyo-red transition-colors cursor-pointer group"
                      >
                        {/* Card image or placeholder */}
                        {item.image_url ? (
                          <div className="aspect-video overflow-hidden bg-gray-50">
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-50 flex items-center justify-center">
                            <span className="text-4xl text-gray-200">📰</span>
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400 font-mono">
                              {new Date(item.published_at).toLocaleDateString("en", { year: "numeric", month: "2-digit", day: "2-digit" })}
                            </span>
                            <span className="border border-toyo-red text-toyo-red text-[10px] px-1.5 py-0.5 font-bold uppercase">
                              {item.event_type || "News"}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-toyo-red transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* News from TOYO Robot (https://www.toyorobot.com/News/Msg) */}
              <div className="mt-14">
                <ToyoRobotNewsSection />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
