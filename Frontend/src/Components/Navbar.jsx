import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-slate-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-white flex items-center">
          <img src={logo} alt="NidhiBook" className="h-12" />
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-slate-300 hover:text-white transition-colors">
            Home
          </a>
          <a href="/about" className="text-slate-300 hover:text-white transition-colors">
            About
          </a>
          <a href="/contact" className="text-slate-300 hover:text-white transition-colors">
            Contact us
          </a>
        </nav>

        {/* Right side buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="/login" className="text-slate-300 hover:text-white transition-colors">
            Log In
          </a>
          <a
            href="/signup"
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Sign Up Free
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
          <nav className="flex flex-col items-center space-y-4 py-4">
            <a
              href="/"
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="/about"
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="/contact"
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </a>
            <a
              href="/login"
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Log In
            </a>
            <a
              href="/signup"
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
              onClick={() => setIsOpen(false)}
            >
              Sign Up Free
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
