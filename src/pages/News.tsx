import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";

/** Cloned from https://www.toyorobot.com/News/Msg — News layout and content */

const TOYO_NEWS_URL = "https://www.toyorobot.com/News/Msg";
const NEWS_UPDATED = "2025/11/18";

const tabs = [
  { label: "News", href: "/news" },
  { label: "Event News", href: "/news/event" },
  { label: "Company Announcements", href: "/news/announcements" },
];

const FEATURED_NEWS = {
  date: NEWS_UPDATED,
  badge: "News",
  title: "TOYO Automation and Yamaha Motor Establish Joint Venture — TY ROBOTICS Co., Ltd.",
  subtitle: "【NEWS RELEASE】",
  link: "https://global.yamaha-motor.com/news/2025/1014/ty.html",
  paragraphs: [
    "TOYO Automation and Yamaha Motor Establish Joint Venture — TY ROBOTICS Co., Ltd. Integrating production and sharing resources to strengthen industrial robot competitiveness",
    "TOYO Automation Co., Ltd. (“TOYO Automation”) and Yamaha Motor Co., Ltd. (Tokyo: 7272; “Yamaha Motor”) are pleased to announce the establishment of a new joint venture company, TY ROBOTICS Co., Ltd. (“TY”), in August 2025.",
    "Located at Yamaha Motor’s Miyakoda Office in Hamamatsu City, Shizuoka Prefecture, Japan, TY is scheduled to begin production in January 2026. Over time, Yamaha Motor will gradually transfer production of its single-axis and Cartesian robot product lines to TY, further strengthening competitiveness in the industrial robotics sector.",
    "Since Yamaha Motor’s capital investment in TOYO Automation in March 2019, both companies have maintained a strong collaborative partnership — including OEM supply of selected robot models and joint development of next-generation products.",
    "The creation of TY ROBOTICS marks a major milestone in this partnership. By integrating production and sharing resources, the two companies aim to shorten lead times, enhance production efficiency, and diversify product offerings, delivering even more competitive automation solutions to customers worldwide.",
    "For decades, TOYO Automation has been dedicated to the R&D and manufacturing of Cartesian robots and linear motion modules for industrial automation.",
    "With continuous global growth in semiconductor, smartphone, and factory automation sectors, TOYO has expanded its presence with sales subsidiaries in China, the U.S., India, Vietnam, Thailand, Japan, and South Korea, and manufacturing bases in China, Japan, and South Korea — ranking among the top three global manufacturers of linear motion modules.",
    "Building on over a decade of expertise in linear motion design and production, TOYO is also developing a new linear motion actuator (“the muscle”) for humanoid robot arms and legs — aiming to play a vital role in the rapidly growing humanoid robotics industry.",
  ],
};

const PAST_NEWS: { date: string; type: string; title: string }[] = [
  { date: "2023/11/09", type: "News", title: "【Exhibition】 「Toyo Robotics Korea」" },
  { date: "2023/02/26", type: "News", title: "東佑達 單軸機器人 助攻自動化" },
  { date: "2022/08/26", type: "News", title: "【自動化展】東佑達奈米系統公司參展 首推精密氣浮單軸平台" },
  { date: "2022/06/23", type: "News", title: "TOYO Xinji plant 2 Groundbreaking Ceremony" },
  { date: "2019/08/21", type: "News", title: "東佑達USB組裝線示範自主實力" },
  { date: "2019/08/21", type: "News", title: "東佑達 秀全自動USB組裝產線" },
  { date: "2019/06/28", type: "News", title: "台南利多 東佑達新吉工業區新廠房投資10億元啟用" },
  { date: "2019/06/28", type: "News", title: "東佑達28日盛大舉行台南新吉智能廠第一期落成啟用典禮" },
];

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
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">News</p>
          <h1 className="text-4xl font-black text-white">News</h1>
          <div className="flex items-center gap-2 mt-3 text-sm">
            <NavLink to="/" className="text-gray-400 hover:text-white transition-colors">Home</NavLink>
            <span className="text-gray-500">&gt;</span>
            <span className="text-toyo-red font-semibold">News</span>
          </div>
        </div>
      </div>

      <SubNav />

      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 mb-6">
            News updated news：{NEWS_UPDATED}
          </p>

          {/* Featured article */}
          <article className="border border-gray-200 rounded-lg overflow-hidden mb-10">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400 font-mono">News updated news：{FEATURED_NEWS.date}</span>
                <span className="border border-toyo-red text-toyo-red text-[10px] px-1.5 py-0.5 font-bold uppercase">{FEATURED_NEWS.badge}</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">{FEATURED_NEWS.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{FEATURED_NEWS.subtitle}</p>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {FEATURED_NEWS.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <a
                href={FEATURED_NEWS.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-toyo-red hover:underline"
              >
                Read more at Yamaha Motor <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </article>

          {/* Past news list */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-black text-gray-900">Past News</h2>
            <a
              href={TOYO_NEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-toyo-red hover:underline"
            >
              View all at toyorobot.com <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <ul className="space-y-3">
            {PAST_NEWS.map((item, i) => (
              <li key={i}>
                <a
                  href={TOYO_NEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-wrap items-baseline gap-2 py-2 border-b border-gray-100 hover:border-toyo-red/30 hover:bg-gray-50/50 px-2 -mx-2 rounded transition-colors group"
                >
                  <span className="text-sm text-gray-500 font-mono shrink-0">{item.date}</span>
                  <span className="text-xs font-semibold text-toyo-red uppercase shrink-0">{item.type}</span>
                  <span className="text-gray-900 font-medium group-hover:text-toyo-red transition-colors">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default News;
