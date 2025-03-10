import { useState, useRef, useEffect, useCallback } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiBell, FiChevronDown } from "react-icons/fi";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const toggleMenu = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const toggleDropdown = useCallback(() => setIsDropdownOpen(!isDropdownOpen), [isDropdownOpen]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigationItems = [
    { label: "Dashboard", href: "#" },
    { label: "Projects", href: "#" },
    { label: "Tasks", href: "#" },
    { label: "Calendar", href: "#" }
  ];

  return (
    <nav className="bg-card dark:bg-dark-card shadow-sm" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9"
                alt="Logo"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9";
                }}
                loading="lazy"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    aria-label={item.label}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">

            <button
              className="p-2 rounded-md text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
              aria-label="Notifications"
            >
              <FiBell className="h-5 w-5" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 p-2 rounded-md text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="User avatar"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
                  }}
                  loading="lazy"
                />
                <FiChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card dark:bg-dark-card ring-1 ring-black ring-opacity-5">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
              aria-expanded={isOpen}
              aria-label="Main menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border dark:border-dark-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="User avatar"
                  loading="lazy"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-accent-foreground">John Doe</div>
                <div className="text-sm font-medium text-accent">john@example.com</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-accent-foreground hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;