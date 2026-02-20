import { useState, useEffect } from "react";
import { Calendar, MapPin, Tag } from "lucide-react";
import { SubNav } from "./News";
import { supabase } from "@/integrations/supabase/client";

interface EventItem {
  id: string;
  title: string;
  excerpt: string | null;
  event_type: string | null;
  event_date: string | null;
  venue: string | null;
  booth: string | null;
  status: string;
  published_at: string;
}

const EventNews = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (supabase as any)
      .from("news_items")
      .select("id, title, excerpt, event_type, event_date, venue, booth, status, published_at")
      .eq("status", "published")
      .eq("category", "event")
      .order("event_date", { ascending: false })
      .then(({ data }: { data: EventItem[] | null }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  const isUpcoming = (e: EventItem) => e.event_date ? new Date(e.event_date) >= new Date() : false;
  const upcoming = events.filter(isUpcoming);
  const completed = events.filter(e => !isUpcoming(e));
  const filtered = filter === "upcoming" ? upcoming : filter === "completed" ? completed : events;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Trade Shows & Events</p>
          <h1 className="text-4xl font-black text-white">Event News</h1>
        </div>
      </div>
      <SubNav />

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 mb-8">
            {[
              { key: "all", label: `All Events (${events.length})` },
              { key: "upcoming", label: `Upcoming (${upcoming.length})` },
              { key: "completed", label: `Completed (${completed.length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 text-sm border transition-colors ${
                  filter === key
                    ? "border-toyo-red bg-toyo-red text-white"
                    : "border-gray-200 hover:border-toyo-red hover:text-toyo-red"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse border border-gray-100 p-6 flex gap-6">
                  <div className="w-48 h-32 bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">No events in this category.</div>
          ) : (
            <div className="space-y-6">
              {filtered.map((event) => {
                const upcoming = event.event_date ? new Date(event.event_date) >= new Date() : false;
                return (
                  <div key={event.id} className="flex gap-6 border border-gray-200 hover:border-toyo-red transition-colors overflow-hidden">
                    <div className="w-48 bg-gray-50 hidden md:flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-12 h-12 text-toyo-red/30" />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 flex-shrink-0 ${
                          upcoming ? "bg-toyo-red/10 text-toyo-red" : "bg-gray-100 text-gray-500"
                        }`}>
                          {upcoming ? "Upcoming" : "Completed"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        {event.event_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.event_date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        )}
                        {event.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>}
                        {event.booth && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{event.booth}</span>}
                      </div>
                      {event.excerpt && <p className="text-gray-500 text-sm">{event.excerpt}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventNews;
