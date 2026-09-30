import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LogoMark } from "./LogoMark";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
  { to: "/dashboard", label: "Dashboard" }
];

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand logo-only" to="/" onClick={() => setOpen(false)} aria-label="TableCraft Solutions home">
          <LogoMark />
        </Link>
        <button className="nav-toggle" type="button" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={open ? "site-nav open" : "site-nav"} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-brand-block">
          <Link className="brand footer-brand logo-only" to="/" aria-label="TableCraft Solutions home">
            <LogoMark />
          </Link>
          <p>Restaurant consultancy for launches, operations, menus, teams, and profitable hospitality systems.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {links.slice(1).map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
