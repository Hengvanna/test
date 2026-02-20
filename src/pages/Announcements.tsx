import { SubNav } from "./News";

const announcements = [
  { date: "2024-12-01", title: "Notice of Annual Holiday Schedule 2025" },
  { date: "2024-11-15", title: "Update on Technical Support Center Hours" },
  { date: "2024-10-28", title: "TOYO ERP System Maintenance Notice – Nov 2" },
  { date: "2024-10-01", title: "Revision of Standard Warranty Terms Effective Jan 2025" },
  { date: "2024-09-12", title: "Opening of New Training Center in Tainan HQ" },
  { date: "2024-08-05", title: "Price List Update – Product Series 2024Q4" },
];

const Announcements = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-toyo-dark py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Official Notices</p>
        <h1 className="text-4xl font-black text-white">Company Announcements</h1>
      </div>
    </div>
    <SubNav />

    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="divide-y divide-gray-100">
          {announcements.map((a) => (
            <div
              key={a.title}
              className="flex items-center gap-6 py-4 hover:bg-toyo-light-gray/50 -mx-4 px-4 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="border border-toyo-red text-toyo-red text-xs px-2 py-0.5 font-semibold">
                  News bulletin
                </span>
              </div>
              <span className="text-toyo-gray text-sm font-mono flex-shrink-0">{a.date}</span>
              <h3 className="text-toyo-dark text-sm group-hover:text-toyo-red transition-colors flex-1">{a.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Announcements;
