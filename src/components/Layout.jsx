import React, { useState } from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

// ✅ Full-Width Responsive Header with Animations
const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className=" shadow-md sticky top-0 z-50 w-full">
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-3">
        <Link to="/" className="text-2xl font-bold text-emerald-00">
          Event<span className="text-blue-500">Hub</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <NavLinks />
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>
      </nav>

      {/* Mobile Dropdown with Slide Animation */}
      <ul
        className={`md:hidden overflow-hidden bg-white border-t border-gray-200 p-4 space-y-2 text-gray-700 transition-all duration-300 ease-in-out ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <NavLinks />
      </ul>
    </header>
  );
};

const NavLinks = () => (
  <>
    <li>
      <Link to="/" className="hover:text-emerald-600">
        Home
      </Link>
    </li>
    <li>
      <Link to="/add-event" className="hover:text-emerald-600">
        Add Event
      </Link>
    </li>
    <li>
      <Link to="/admin" className="hover:text-emerald-600">
        Admin
      </Link>
    </li>
    <li>
      <Link to="/login" className="hover:text-emerald-600">
        Login
      </Link>
    </li>
    <li>
      <Link to="/register" className="hover:text-emerald-600">
        Register
      </Link>
    </li>
  </>
);

// ✅ Full-Width Footer
const Footer = () => (
  <footer className="bg-emerald-500 text-white text-center py-6 mt-10 w-full">
    <p className="text-sm">
      © {new Date().getFullYear()} Neighborhood Event Hub — All Rights Reserved
    </p>
  </footer>
);
