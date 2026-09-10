import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../ui/Logo";
import Button from "../ui/Button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Features", to: "/#features" },
  { label: "For Doctors", to: "/#for-doctors" },
  { label: "For Patients", to: "/#for-patients" },
  { label: "About Us", to: "/#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleAnchorClick = (to) => (e) => {
    e.preventDefault();
    setOpen(false);

    const id = to.split("#")[1];

    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-ink-950/90 backdrop-blur-md border-b border-ink-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
        >
          <Logo size="sm" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.to.startsWith("/#") ? (
                <a
                  href={link.to}
                  onClick={handleAnchorClick(link.to)}
                  className="text-sm text-mist-300 hover:text-teal-300 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.to}
                  className="text-sm text-mist-300 hover:text-teal-300 transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            as={Link}
            to="/login"
            variant="outline"
            size="sm"
          >
            Login
          </Button>

          <Button
            as={Link}
            to="/signup"
            size="sm"
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-mist-100 p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {open && (
        <div className="lg:hidden border-t border-ink-border bg-ink-950 px-5 py-5">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.to.startsWith("/#") ? (
                  <a
                    href={link.to}
                    onClick={handleAnchorClick(link.to)}
                    className="text-mist-300 text-sm hover:text-teal-300 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="text-mist-300 text-sm hover:text-teal-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 mt-5">
            <Button
              as={Link}
              to="/login"
              variant="outline"
              fullWidth
              onClick={() => setOpen(false)}
            >
              Login
            </Button>

            <Button
              as={Link}
              to="/signup"
              fullWidth
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}