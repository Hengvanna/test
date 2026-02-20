import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const tabs = [
  { label: "News", href: "/news" },
  { label: "Event News", href: "/news/event" },
  { label: "Company Announcements", href: "/news/announcements" },
];

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
            <div className="py-20 text-center text-gray-400 text-sm">No news available yet.</div>
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
