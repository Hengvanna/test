import { Link } from "react-router-dom";
import { ArrowRight, Award, Shield, Clock, Users } from "lucide-react";


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
        <p className="text-toyo-red font-semibold uppercase tracking-widest text-sm mb-2">About HSF</p>
        <h1 className="text-4xl font-black text-white">Company Profiles</h1>
      </div>
    </div>

    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-black text-toyo-dark mb-4">Who We Are</h2>
          <p className="text-toyo-gray leading-relaxed mb-4">
          HSF Electric Corporation is a leading manufacturer of electric actuators, robotic systems, and industrial automation solutions. Founded in 2020 in <strong>Foshan</strong>, <strong>China</strong>, we have grown from a regional manufacturer, with nearly <strong>85% of our products supplied to OEM partners under their own brands</strong>.
          </p>
          <p className="text-toyo-gray leading-relaxed mb-4">
          We have established a mission to become a <strong>global automation partner</strong> and are expanding our business with the objective of setting up <strong>supply chain hubs in the ASEAN region</strong>, where your company could become part of our <strong>wholesale or distributor network</strong> for your respective or regional markets.
          </p>
          <p className="text-toyo-gray leading-relaxed">
          Our product portfolio includes <strong>electric actuators, motorized slides, linear motors, SCARA robots, Cartesian robots, controllers, and accessories</strong> — all designed with precision engineering and built to deliver <strong>high performance in demanding industrial environments</strong>.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Clock, label: "6+ Years", sub: "Industry Experience" },
            { icon: Users, label: "85% OEM ", sub: "China Clients" },
            { icon: Award, label: "Ready for ", sub: "ASEAN + Europe Partnership" },
            { icon: Shield, label: "Certified by ", sub: "Districutors" },
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

    {/* YouTube: HSF GLTH/GLTB Series */}
    <section className="py-16 px-6 bg-toyo-light-gray">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-toyo-dark mb-6 text-center">See HSF in Action</h2>
        <p className="text-toyo-gray text-center mb-8 max-w-2xl mx-auto">
          GLTH / GLTB Series — flat-type embedded electric slides: low height, high rigidity.
        </p>
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black">
          <iframe
            title="HSF ROBOT GLTH / GLTB Series"
            src="https://www.youtube.com/embed/miD-k8X2E50"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
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
      <p className="text-white font-bold text-lg mb-4">Ready to work with HSF?</p>
      <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-toyo-red px-6 py-3 font-bold hover:bg-white/90 transition-colors">
        Get In Touch <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
);

export default About;
