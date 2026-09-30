import { LogOut, MapPin, Menu, Phone, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { contactDetails } from "../content/contactDetails";
import { readStoredUserSession, storeUserSession, userSessionChangedEvent } from "../content/dashboardUsers";
import type { DashboardUserSession } from "../types";
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
  const [userSession, setUserSession] = useState<DashboardUserSession | null>(null);

  useEffect(() => {
    const syncUserSession = () => setUserSession(readStoredUserSession());
    syncUserSession();
    window.addEventListener(userSessionChangedEvent, syncUserSession);
    window.addEventListener("storage", syncUserSession);
    return () => {
      window.removeEventListener(userSessionChangedEvent, syncUserSession);
      window.removeEventListener("storage", syncUserSession);
    };
  }, []);

  const handleUserLogout = () => {
    storeUserSession(null);
    setOpen(false);
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand logo-only" to="/" onClick={() => setOpen(false)} aria-label="TableCraft Solutions home">
          <LogoMark />
        </Link>
        <div className="header-actions">
          {userSession && (
            <div className="user-badge" aria-label={`Logged in as ${userSession.firstName}`}>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <UserRound size={16} />
                <span>{userSession.firstName}</span>
              </Link>
              <button type="button" onClick={handleUserLogout} aria-label="Sign out user">
                <LogOut size={15} />
              </button>
            </div>
          )}
          <button className="nav-toggle" type="button" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
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
      <a className="whatsapp-float" href={contactDetails.whatsappUrl} target="_blank" rel="noreferrer" aria-label={contactDetails.whatsappLabel}>
        <svg aria-hidden="true" viewBox="0 0 32 32" width="24" height="24" focusable="false">
          <path d="M16 3.2c-7.05 0-12.8 5.58-12.8 12.45 0 2.34.68 4.62 1.96 6.58L3.6 28.8l6.78-1.5A13.05 13.05 0 0 0 16 28.1c7.05 0 12.8-5.58 12.8-12.45S23.05 3.2 16 3.2Zm0 22.54c-1.74 0-3.44-.44-4.94-1.27l-.36-.2-4.02.9.92-3.86-.24-.39a9.96 9.96 0 0 1-1.8-5.27c0-5.56 4.68-10.09 10.44-10.09s10.44 4.53 10.44 10.09S21.76 25.74 16 25.74Zm5.72-7.56c-.31-.15-1.84-.88-2.13-.98-.28-.11-.49-.15-.7.15-.2.3-.8.98-.98 1.18-.18.2-.36.22-.67.07-.31-.15-1.31-.47-2.49-1.5-.92-.8-1.54-1.79-1.72-2.09-.18-.3-.02-.46.14-.61.14-.14.31-.36.47-.54.16-.18.2-.3.31-.5.1-.2.05-.38-.03-.53-.08-.15-.7-1.63-.95-2.23-.25-.58-.5-.5-.7-.5h-.6c-.2 0-.53.07-.8.38-.28.3-1.06 1-1.06 2.45s1.09 2.85 1.24 3.05c.16.2 2.15 3.18 5.2 4.46.73.3 1.3.49 1.74.63.73.22 1.4.19 1.92.12.59-.09 1.84-.73 2.1-1.43.26-.7.26-1.3.18-1.43-.08-.13-.28-.2-.59-.35Z" />
        </svg>
        <span>WhatsApp</span>
      </a>
      <footer className="site-footer">
        <div className="footer-brand-block">
          <Link className="brand footer-brand logo-only" to="/" aria-label="TableCraft Solutions home">
            <LogoMark />
          </Link>
          <p>Restaurant consultancy for launches, operations, menus, teams, and profitable hospitality systems.</p>
          <div className="footer-contact-list" aria-label="TableCraft contact details">
            <a href={contactDetails.phoneHref}>
              <Phone size={16} /> Farhan: {contactDetails.phoneDisplay}
            </a>
            <span>
              <MapPin size={16} /> {contactDetails.location}
            </span>
          </div>
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
