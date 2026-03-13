import { Link } from "react-router-dom";
import hsfLogo from "@/assets/HSF_Logo.png";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "hsl(var(--toyo-dark))" }} className="text-white">
      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={hsfLogo} alt="HSF Logo" className="h-16 brightness-0 invert" />
            <p style={{ color: "hsl(var(--toyo-gray))" }} className="mt-4 text-sm leading-relaxed max-w-xs">
              Global leader in electric actuator &amp; robotic automation since 1991.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Products</h4>
            <ul className="space-y-3">
              {[
                { label: "Single-axis Linear Actuators", href: "/products?cat=single-axis" },
                { label: "Multi-axis Linear Actuators", href: "/products?cat=multi-axis" },
                { label: "Electric Grippers", href: "/products?cat=grippers" },
                { label: "Desktop Robots", href: "/products?cat=desktop" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    style={{ color: "hsl(var(--toyo-gray))" }}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Downloads", href: "/download" },
                { label: "Technical Support", href: "/technical" },
                { label: "News", href: "/news" },
                { label: "About Us", href: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    style={{ color: "hsl(var(--toyo-gray))" }}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-2">
              <li style={{ color: "hsl(var(--toyo-gray))" }} className="text-sm leading-snug">
                Phnom Penh<br />
                Cambodia
              </li>
              <li>
                <a
                  href="mailto:alvin@hsf-robot.com"
                  style={{ color: "hsl(var(--toyo-gray))" }}
                  className="text-sm hover:text-white transition-colors"
                >
                  alvin@hsf-robot.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderColor: "hsl(var(--toyo-gray) / 0.2)" }} className="border-t">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-center">
          <span style={{ color: "hsl(var(--toyo-gray))" }} className="text-xs">
            © 2026 HSF Electric Corporation. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

