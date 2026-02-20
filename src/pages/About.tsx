import { Link } from "react-router-dom";
import { ArrowRight, Award, Shield, Clock, Users } from "lucide-react";

const timeline = [
  { year: "1991", event: "TOYO Electric Corporation founded in Tainan, Taiwan." },
  { year: "1998", event: "Launched first electric actuator product line for industrial automation." },
  { year: "2003", event: "Expanded operations with new manufacturing facility." },
  { year: "2008", event: "Entered European and Southeast Asian markets." },
  { year: "2013", event: "Achieved ISO 9001 & ISO 14001 certifications." },
  { year: "2018", event: "Released next-generation SCARA and Cartesian robot series." },
  { year: "2024", event: "Serving 10,000+ clients across 50+ countries worldwide." },
];

const certs = [
  { name: "ISO 9001", desc: "Quality Management System" },
  { name: "ISO 14001", desc: "Environmental Management" },
  { name: "CE", desc: "European Conformity" },
  { name: "RoHS", desc: "Restriction of Hazardous Substances" },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-toyo-dark py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">About TOYO</p>
        <h1 className="text-4xl font-black text-white">Company Profile</h1>
      </div>
    </div>

    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-black text-toyo-dark mb-4">Who We Are</h2>
          <p className="text-toyo-gray leading-relaxed mb-4">
            TOYO Electric Corporation is a leading manufacturer of electric actuators, robotic systems, and industrial automation solutions. Founded in 1991 in Tainan, Taiwan, we have grown from a regional manufacturer to a global automation partner trusted by thousands of companies worldwide.
          </p>
          <p className="text-toyo-gray leading-relaxed mb-4">
            Our product portfolio spans electric actuators, motorized slides, linear motors, SCARA robots, Cartesian robots, controllers, and accessories — all designed with precision engineering and built to perform in the most demanding industrial environments.
          </p>
          <p className="text-toyo-gray leading-relaxed">
            We champion electric automation over conventional pneumatic systems, delivering superior energy efficiency, repeatability, and cleanliness that modern manufacturing demands.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Clock, label: "30+ Years", sub: "Industry Experience" },
            { icon: Users, label: "10K+", sub: "Global Clients" },
            { icon: Award, label: "50+", sub: "Countries Served" },
            { icon: Shield, label: "ISO Certified", sub: "Quality Assured" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-toyo-light-gray p-6 text-center">
              <Icon className="w-8 h-8 text-toyo-red mx-auto mb-2" />
              <div className="font-black text-toyo-dark text-xl">{label}</div>
              <div className="text-toyo-gray text-sm">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-16 px-6 bg-toyo-light-gray">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-toyo-dark mb-10 text-center">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-toyo-red/30" />
          <div className="space-y-8">
            {timeline.map((item) => (
              <div key={item.year} className="flex gap-6 items-start">
                <div className="w-16 text-right flex-shrink-0">
                  <span className="font-black text-toyo-red text-sm">{item.year}</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-toyo-red border-2 border-white" />
                  <p className="text-toyo-gray text-sm leading-relaxed pl-4">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Certifications */}
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-black text-toyo-dark mb-8">International Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certs.map((cert) => (
            <div key={cert.name} className="border border-toyo-red/20 p-6">
              <div className="text-3xl font-black text-toyo-red mb-2">{cert.name}</div>
              <p className="text-toyo-gray text-sm">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <div className="text-center py-8 px-6 bg-toyo-red">
      <p className="text-white font-bold text-lg mb-4">Ready to work with TOYO?</p>
      <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-toyo-red px-6 py-3 font-bold hover:bg-white/90 transition-colors">
        Get In Touch <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

export default About;
