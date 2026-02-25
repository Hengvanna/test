import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, Menu, Globe, Home, Undo2, User } from "lucide-react";
import hsfLogo from "@/assets/HSF_Logo.png";

const megaMenuData = [
  {
    col: "About HSF",
    sections: [
      {
        title: "About HSF",
        links: [
          { label: "Company Introduction & History", href: "/about" },
          { label: "Quality & Service", href: "/about/service" },
          { label: "Global Locations", href: "/about/global" },
        ],
      },
      {
        title: "News",
        links: [
          { label: "News", href: "/news" },
          { label: "Event News", href: "/news/event" },
          { label: "Company Announcements", href: "/news/announcements" },
        ],
      },
    ],
  },
  {
    col: "Product",
    sections: [
      {
        title: "Product",
        links: [
          { label: "Single-axis Linear Actuators", href: "/products?cat=single-axis" },
          { label: "Multi-axis Linear Actuators", href: "/products?cat=multi-axis" },
          { label: "Servo Cylinders", href: "/products?cat=servo-cylinders" },
          { label: "Miniature Cylinders", href: "/products?cat=miniature" },
          { label: "Electric Grippers", href: "/products?cat=grippers" },
          { label: "Linear Motor Robots", href: "/products?cat=linear-motor" },
          { label: "Nanometer-precision Air Bearing System", href: "/products?cat=air-bearing" },
          { label: "Nanometer-precision Linear Motor System", href: "/products?cat=nano-linear" },
          { label: "Air Bearing Stage / Alignment Stage", href: "/products?cat=alignment-stage" },
          { label: "Desktop Robots", href: "/products?cat=desktop" },
          { label: "Clean Room Series", href: "/products?cat=cleanroom" },
          { label: "Automated Guided Vehicles", href: "/products?cat=agv" },
          { label: "Controllers", href: "/products?cat=controllers" },
          { label: "Discontinued Product List", href: "/products?cat=discontinued" },
        ],
      },
    ],
  },
  {
    col: "Downloads",
    sections: [
      {
        title: "Downloads",
        links: [
          { label: "Product Catalog", href: "/download?cat=catalogs" },
          { label: "CAD Drawings", href: "/download?cat=drawings" },
          { label: "User Manuals", href: "/download?cat=manuals" },
          { label: "Software", href: "/download?cat=software" },
        ],
      },
    ],
  },
  {
    col: "Technical Support",
    sections: [
      {
        title: "Technical Support",
        links: [
          { label: "Model Selection Software", href: "/technical" },
          { label: "Maintenance Contact Form", href: "/contact" },
        ],
      },
    ],
  },
  {
    col: "Contact Us",
    sections: [
      {
        title: "Contact Us",
        links: [
          { label: "Contact Form", href: "/contact" },
        ],
      },
      {
        title: "Business partner",
        links: [
          { label: "HSF ROBOTICS . Japan", href: "/business-partner" },
          { label: "HSF Nano System Co., Ltd.", href: "/business-partner" },
          { label: "ECON ROBOT INC.", href: "/business-partner" },
          { label: "MSI Co., Ltd.", href: "/business-partner" },
          { label: "HSF ROBOTICS KOREA", href: "/business-partner" },
          { label: "HSF ROBOTICS PRIVATE LIMITED INDIA", href: "/business-partner" },
        ],
      },
    ],
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-6 flex items-center h-14">
          {/* Left: Menu toggle + utility icons */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 pr-6 text-gray-800 hover:text-toyo-red transition-colors text-sm font-medium"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Menu</span>
            </button>
            {/* Vertical divider */}
            <div className="h-6 w-px bg-gray-300 mr-4" />
            <div className="flex items-center gap-3 text-gray-500">
              <button className="hover:text-gray-800 transition-colors" title="My Account" onClick={() => navigate("/login")}>
                <User className="w-4 h-4" />
              </button>
              <button className="hover:text-gray-800 transition-colors" onClick={() => navigate("/")}>
                <Home className="w-4 h-4" />
              </button>
              <button className="hover:text-gray-800 transition-colors" onClick={() => navigate(-1)}>
                <Undo2 className="w-4 h-4" />
              </button>
              <button className="hover:text-gray-800 transition-colors flex items-center gap-1 text-sm">
                <Globe className="w-4 h-4" />
                <span>Language</span>
              </button>
            </div>
          </div>

          {/* Right: HSF Logo */}
          <div className="ml-auto">
            <Link to="/">
              <img src={hsfLogo} alt="HSF Logo" className="h-16" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      {menuOpen && (
        <>
          <div className="fixed top-14 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
            <div className="w-full px-6 py-8">
              <div className="grid grid-cols-5 gap-0 divide-x divide-gray-200">
                {megaMenuData.map((col) => (
                  <div key={col.col} className="px-6 first:pl-0 last:pr-0">
                    {col.sections.map((section, si) => (
                      <div key={section.title} className={si > 0 ? "mt-6" : ""}>
                        <h3 className="font-bold text-gray-900 text-sm mb-3">
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                to={link.href}
                                className="text-sm text-gray-500 hover:text-gray-900 transition-colors block leading-snug"
                                onClick={() => setMenuOpen(false)}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-14 z-30 bg-black/10"
            onClick={() => setMenuOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default Navbar;
