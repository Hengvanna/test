import { useState } from "react";
import { ChevronDown, ChevronUp, Zap, Wind, CheckCircle, XCircle } from "lucide-react";

const faqs = [
  { q: "What is the advantage of electric over pneumatic?", a: "Electric actuators offer programmable positioning, energy efficiency (no compressor), cleanliness (no air leaks or oil mist), and precise force/speed control that pneumatic systems cannot match." },
  { q: "What is the repeatability of TOYO actuators?", a: "Standard models achieve ±0.01mm repeatability. High-precision variants reach ±0.005mm or better." },
  { q: "Do TOYO products support EtherCAT?", a: "Yes. Our TD-5 series drivers and TC-10/15 controllers fully support EtherCAT, CC-Link, PROFIBUS, and Ethernet/IP fieldbus protocols." },
  { q: "What industries use TOYO products?", a: "Semiconductors, electronics assembly, medical devices, automotive, food & beverage, and general factory automation." },
  { q: "Are spare parts readily available?", a: "Yes. TOYO maintains a comprehensive spare parts inventory at our Taiwan HQ and regional warehouses. Most common parts ship within 48 hours." },
];

const comparisonRows = [
  { feature: "Positioning Accuracy", electric: "±0.01mm or better", pneumatic: "Limited — end-stop only" },
  { feature: "Speed Control", electric: "Programmable 0–100%", pneumatic: "Throttle valve only" },
  { feature: "Force Control", electric: "Precise, programmable", pneumatic: "Pressure regulator only" },
  { feature: "Energy Efficiency", electric: "High — only when moving", pneumatic: "Low — constant compressor" },
  { feature: "Cleanliness", electric: "Oil-free, clean room ready", pneumatic: "Risk of oil mist/moisture" },
  { feature: "Noise Level", electric: "Low", pneumatic: "High — exhaust noise" },
  { feature: "Maintenance", electric: "Low — no compressor", pneumatic: "High — filter/drain/compressor" },
  { feature: "Multi-point Positioning", electric: "Unlimited via controller", pneumatic: "Only 2 positions" },
];

const Technical = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-toyo-dark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Resources & Support</p>
          <h1 className="text-4xl font-black text-white">Technical Information</h1>
        </div>
      </div>

      {/* Key Highlights */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-toyo-dark mb-8">Key Technology Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Ball Screw Drive", desc: "Low backlash, high rigidity ball screw mechanisms for precision linear motion." },
              { title: "Built-in Encoder", desc: "Absolute/incremental encoders integrated for accurate position feedback without external sensors." },
              { title: "Auto Tuning", desc: "One-click gain auto-tuning reduces setup time and achieves optimal servo response." },
              { title: "IP65 Rating", desc: "Select models feature IP65 protection for washdown and dusty environments." },
              { title: "EtherCAT Support", desc: "Real-time fieldbus connectivity for seamless integration into modern factory networks." },
              { title: "Cleanroom Ready", desc: "Oil-free electric drive ideal for semiconductor and pharmaceutical cleanroom environments." },
            ].map((feat) => (
              <div key={feat.title} className="border-t-4 border-toyo-red p-5 bg-toyo-light-gray">
                <h3 className="font-bold text-toyo-dark mb-2">{feat.title}</h3>
                <p className="text-toyo-gray text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-12 px-6 bg-toyo-light-gray">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black text-toyo-dark">Electric vs Pneumatic</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-toyo-dark text-white">
                  <th className="text-left px-6 py-3 text-sm font-semibold">Feature</th>
                  <th className="px-6 py-3 text-sm font-semibold">
                    <div className="flex items-center gap-1 justify-center"><Zap className="w-4 h-4 text-toyo-red" />Electric</div>
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold">
                    <div className="flex items-center gap-1 justify-center"><Wind className="w-4 h-4" />Pneumatic</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-toyo-light-gray/50"}>
                    <td className="px-6 py-3 text-sm font-medium text-toyo-dark">{row.feature}</td>
                    <td className="px-6 py-3 text-sm text-center">
                      <span className="flex items-center gap-1 justify-center text-green-700">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" />{row.electric}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-center">
                      <span className="flex items-center gap-1 justify-center text-toyo-gray">
                        <XCircle className="w-3 h-3 flex-shrink-0 text-red-400" />{row.pneumatic}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-toyo-dark mb-8">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-toyo-dark hover:bg-toyo-light-gray/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-toyo-red" /> : <ChevronDown className="w-4 h-4 text-toyo-gray" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-toyo-gray text-sm leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Technical;
