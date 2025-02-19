import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  {
    label: "Services",
    links: [
      { name: "Web Development", href: "/web-dev" },
      { name: "Interface Design", href: "/interface-design" },
      { name: "SEO", href: "/seo" },
      { name: "Branding", href: "/branding" },
    ],
  },
  {
    label: "Products",
    links: [
      { name: "Algochurn", href: "https://algochurn.com" },
      { name: "Tailwind Master Kit", href: "https://tailwindmasterkit.com" },
      { name: "Moonbeam", href: "https://gomoonbeam.com" },
      { name: "Rogue", href: "https://userogue.com" },
    ],
  }
];

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-gray-50 shadow-md fixed top-4 left-1/2 transform -translate-x-1/2 w-[70%] rounded-full z-0">
      <div className="flex items-center justify-around py-2 px-6">
        <Link to="/" className="text-lg font-semibold text-gray-800 cursor-pointer">
          Chationix
        </Link>
        <ul className="flex space-x-6">
          {navItems.map((item, index) => (
            <li
              key={index}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 transition">
                {item.label}
                <ChevronDown size={16} />
              </button>
              <div
                className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 ${activeDropdown === index ? "opacity-100 scale-100" : ""
                  }`}
              >
                {item.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </li>
          ))}
          <li className="text-gray-800 cursor-pointer">
            <Link to='#'>Pricing</Link>
          </li>
        </ul>
        <div className="relative">
          <button
            className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              className="h-8 w-8 rounded-full object-cover object-center ring ring-white"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
            />
            <ChevronDown size={16} />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md py-2">
              <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                View Profile
              </Link>
              <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Settings
              </Link>
              <Link to="/download" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Download
              </Link>
              <Link to="/help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Help Center
              </Link>
              <Link to="/changelog" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Changelog
              </Link>
              <Link to="/api" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                API
              </Link>
              <Link to="/logout" className="block px-2 rounded-lg mx-2 py-2 text-gray-700 hover:bg-red-500 hover:text-white">
                Log out
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
