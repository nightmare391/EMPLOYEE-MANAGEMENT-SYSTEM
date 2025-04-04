import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/search", label: "Search" },
    { path: "/add", label: "Add Employee" },
    { path: "/manage", label: "Manage" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-primary font-bold text-xl">EMS</span>
            <span className="ml-2 text-gray-600 font-medium">Employee Management System</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <span
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                    isActive(link.path)
                      ? "text-primary"
                      : "text-gray-500 hover:text-primary"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="p-2 rounded-md text-gray-500 hover:text-primary focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <span
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                    isActive(link.path)
                      ? "text-primary bg-gray-50"
                      : "text-gray-500 hover:text-primary hover:bg-gray-50"
                  )}
                  onClick={closeMenu}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
