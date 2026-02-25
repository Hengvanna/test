import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { SubNav } from "./News";

/** Cloned from https://www.toyorobot.com/News/Event — Event News layout and content */

const EXHIBITION_UPDATED = "2024/11/11";

const GLOBAL_EXHIBITION_2025 = [
  { name: "SMART FACTORY + AUTOMATION WORLD", date: "2025/03/12-03/14", venue: "COEX Convention & Exhibition Center, Korea" },
  { name: "Automate 2025", date: "2025/05/12-05/15", venue: "MCCORMICK PLACE | CHICAGO, US" },
  { name: "ACMEE 2025", date: "2025/06/19-06/23", venue: "Chennai, India" },
  { name: "BAC NINH", date: "2025/11/06-11/08", venue: "Kinh Bac Center, Vietnam" },
  { name: "Touch Taiwan", date: "2025/04/16-04/18", venue: "TaiNEX1, Taiwan" },
  { name: "Automation Taipei", date: "2025/08/20-08/23", venue: "TaiNEX1, Taiwan" },
  { name: "SEMICON TAIWAN", date: "2025/09/10-09/12", venue: "TaiNEX2, Taiwan" },
  { name: "Productronica China", date: "2025/03/26-03/29", venue: "Shanghai New International Expo Centre, China" },
  { name: "ITES", date: "2025/03/26-03/29", venue: "Shenzhen World Exhibition & Convention Center, China" },
  { name: "China International Industry Fair", date: "2025/09/23~", venue: "NECC (Shanghai), China" },
];

const PAST_EVENTS: { date: string; type: string; title: string }[] = [
  { date: "2024/04/29", type: "Exhibition", title: "【HSF EVENTS】AUTOMATE USA 2024" },
  { date: "2024/04/29", type: "Exhibition", title: "【HSF EVENTS】2024 高雄自動化展" },
  { date: "2023/11/03", type: "Seminar", title: "【HSF ROBOTICS KOREA】2023 Distributor Briefing" },
  { date: "2023/10/25", type: "Exhibition", title: "2023 Motion Control Show - KOREA" },
  { date: "2023/10/19", type: "Exhibition", title: "【HSF Events】2023 Motion Control Show - South KOREA" },
  { date: "2023/09/04", type: "Exhibition", title: "【HSF Events】2023 SEMICON TAIWAN" },
  { date: "2023/08/10", type: "Exhibition", title: "【HSF Events】2023 台北國際自動化工業大展" },
  { date: "2023/04/17", type: "Exhibition", title: "【HSF Events】Touch Taiwan 2023" },
];

const EVENT_PAGE_URL = "https://www.toyorobot.com/News/Event";

const EventNews = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">News</p>
          <h1 className="text-4xl font-black text-white">Event News</h1>
          <div className="flex items-center gap-2 mt-3 text-sm">
            <NavLink to="/" className="text-gray-400 hover:text-white transition-colors">Home</NavLink>
            <span className="text-gray-500">&gt;</span>
            <NavLink to="/news" className="text-gray-400 hover:text-white transition-colors">News</NavLink>
            <span className="text-gray-500">&gt;</span>
            <span className="text-toyo-red font-semibold">Event News</span>
          </div>
        </div>
      </div>
      <SubNav />

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 mb-6">
            Exhibition updated news：{EXHIBITION_UPDATED}
          </p>

          {/* 2025 HSF Global Exhibition */}
          <article className="border border-gray-200 rounded-lg overflow-hidden mb-10">
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400 font-mono">Exhibition updated news：{EXHIBITION_UPDATED}</span>
                <span className="border border-toyo-red text-toyo-red text-[10px] px-1.5 py-0.5 font-bold uppercase">Exhibition</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">【HSF EVENTS】 2025 HSF Global Exhibition</h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                The <strong>HSF Global Exhibition 2025</strong> is coming soon! Join industry leaders from around the world to showcase innovations and explore business opportunities. Stay tuned for more exciting details!
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Exhibition Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {GLOBAL_EXHIBITION_2025.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
                      <td className="py-3 px-4 text-gray-600">{row.date}</td>
                      <td className="py-3 px-4 text-gray-600">{row.venue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* Past events list */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-black text-gray-900">Past Events</h2>
            <a
              href={EVENT_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-toyo-red hover:underline"
            >
              View all at toyorobot.com <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <ul className="space-y-3">
            {PAST_EVENTS.map((event, i) => (
              <li key={i}>
                <a
                  href={EVENT_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-wrap items-baseline gap-2 py-2 border-b border-gray-100 hover:border-toyo-red/30 hover:bg-gray-50/50 px-2 -mx-2 rounded transition-colors group"
                >
                  <span className="text-sm text-gray-500 font-mono shrink-0">{event.date}</span>
                  <span className="text-xs font-semibold text-toyo-red uppercase shrink-0">{event.type}</span>
                  <span className="text-gray-900 font-medium group-hover:text-toyo-red transition-colors">{event.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default EventNews;
