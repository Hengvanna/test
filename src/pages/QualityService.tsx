import { Shield, Award, Clock, CheckCircle, Wrench, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";

const certifications = [
  { name: "ISO 9001", desc: "Quality Management System — ensuring consistent product quality and customer satisfaction." },
  { name: "ISO 14001", desc: "Environmental Management System — committed to sustainable manufacturing practices." },
  { name: "CE", desc: "European Conformity — products meet EU safety, health, and environmental standards." },
  { name: "RoHS", desc: "Restriction of Hazardous Substances — compliant with global environmental regulations." },
];

const services = [
  {
    icon: Wrench,
    title: "Technical Support",
    desc: "Dedicated engineers provide fast, expert assistance for installation, programming, and troubleshooting your HSF systems.",
  },
  {
    icon: HeadphonesIcon,
    title: "After-Sales Service",
    desc: "Comprehensive after-sales care including on-site support, remote diagnostics, and preventive maintenance programs.",
  },
  {
    icon: Clock,
    title: "Rapid Response",
    desc: "24-hour response commitment for critical issues, with local service centers in major markets to minimize downtime.",
  },
  {
    icon: Award,
    title: "Warranty Coverage",
    desc: "Industry-leading warranty on all products, backed by genuine replacement parts and factory-trained technicians.",
  },
];

const qualitySteps = [
  { step: "01", title: "Design & Engineering", desc: "Every product is engineered with precision, using simulation and prototype testing before production." },
  { step: "02", title: "Material Sourcing", desc: "We source only certified materials from audited suppliers who meet our quality and environmental standards." },
  { step: "03", title: "Manufacturing", desc: "ISO 9001-certified production lines with automated quality checkpoints at every stage." },
  { step: "04", title: "Final Inspection", desc: "100% functional testing and dimensional verification before products leave our facility." },
  { step: "05", title: "Delivery & Installation", desc: "Careful packaging and logistics support, with optional installation assistance from our technical team." },
  { step: "06", title: "Ongoing Support", desc: "Post-delivery follow-up, maintenance contracts, and continuous improvement based on customer feedback." },
];

const QualityService = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <div className="bg-toyo-dark py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">About HSF</p>
        <h1 className="text-4xl font-black text-white">Quality & Service</h1>
        <p className="text-gray-400 mt-3 max-w-xl">
        With over 6 years of precision manufacturing experience, we specialize in supplying OEM accessories, components, and production parts for our clients, supporting their international trade activities while exporting our core products to global markets.        </p>
      </div>
    </div>

    {/* Quality Philosophy */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Our Commitment</p>
          <h2 className="text-3xl font-black text-toyo-dark mb-4">Quality is always International Standard</h2>
          <p className="text-toyo-gray leading-relaxed mb-4">
          At HSF, quality is strictly controlled before shipment. The continuous repeat orders from our major clients reflect the trust they place in us and demonstrate our commitment to maintaining the highest manufacturing standards in the region. Our production and quality management operating 24/7, with real-time process monitoring, unique design capabilities, and strict compliance with quality standards
          </p>
        </div>
      
      </div>
    </section>

    {/* Quality Process */}
    <section className="py-16 px-6 bg-toyo-light-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Process</p>
          <h2 className="text-3xl font-black text-toyo-dark">From Design to Delivery</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qualitySteps.map((step) => (
            <div key={step.step} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl font-black text-toyo-red/20 mb-3">{step.step}</div>
              <h3 className="font-bold text-toyo-dark text-lg mb-2">{step.title}</h3>
              <p className="text-toyo-gray text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Certifications */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Certifications</p>
          <h2 className="text-3xl font-black text-toyo-dark">International Standards</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div key={cert.name} className="border border-toyo-red/20 rounded-xl p-6 text-center hover:border-toyo-red/50 transition-colors">
              <div className="text-3xl font-black text-toyo-red mb-3">{cert.name}</div>
              <p className="text-toyo-gray text-sm leading-relaxed">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Service */}
    <section className="py-16 px-6 bg-toyo-light-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">Service</p>
          <h2 className="text-3xl font-black text-toyo-dark">We Support You Every Step</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-gray-200 flex gap-4">
              <div className="w-12 h-12 bg-toyo-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-toyo-red" />
              </div>
              <div>
                <h3 className="font-bold text-toyo-dark text-lg mb-1">{title}</h3>
                <p className="text-toyo-gray text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <div className="text-center py-12 px-6 bg-toyo-red">
      <p className="text-white font-bold text-lg mb-4">Need technical assistance?</p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 bg-white text-toyo-red px-6 py-3 font-bold rounded-lg hover:bg-white/90 transition-colors"
      >
        Contact Support
      </Link>
    </div>
  </div>
);

export default QualityService;
