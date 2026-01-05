// src/components/layout/Navbar.jsx
import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

/**
 * Navbar
 * - Works for both public pages and dashboard
 * - Shows different actions based on auth (token in localStorage)
 * - Includes small responsive mobile menu (no CSS framework required)
 *
 * Usage:
 * 1) Public pages: place <Navbar /> at top (optional)
 * 2) DashboardLayout: you can use this instead of the current top bar
 */

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const authMode = useMemo(() => localStorage.getItem("auth_mode") || "user", []);
  const isAuthed = Boolean(token);
  const roleLabel = authMode === "company" ? "Company" : "User";

  const [open, setOpen] = useState(false);

  const isDashboard = location.pathname.startsWith("/dashboard");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_mode");
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const goLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  const goRegisterUser = () => {
    setOpen(false);
    navigate("/register/user");
  };

  const goRegisterCompany = () => {
    setOpen(false);
    navigate("/register/company");
  };

  return (
    <header style={styles.wrap}>
      <div style={styles.bar}>
        <Link to="/" style={styles.brand} onClick={() => setOpen(false)}>
          <span style={styles.logoDot} />
          <span style={styles.brandText}>ArminCloud</span>
        </Link>

        {/* Desktop nav */}
        <nav style={styles.desktopNav}>
          {!isAuthed ? (
            <>
              <NavItem to="/" label="Home" />
              <NavItem to="/login" label="Login" />
              <NavItem to="/register/user" label="Register User" />
              <NavItem to="/register/company" label="Register Company" />
            </>
          ) : (
            <>
              <NavItem to="/dashboard/machines" label="Machines" />
              <NavItem to="/dashboard/profile" label="Profile" />
            </>
          )}
        </nav>

        <div style={styles.right}>
          {isAuthed ? <span style={styles.rolePill}>{roleLabel}</span> : null}

          {!isAuthed ? (
            <div style={styles.desktopActions}>
              <button onClick={goLogin} style={styles.ghostBtn}>
                Login
              </button>
              <button onClick={goRegisterUser} style={styles.primaryBtn}>
                Register
              </button>
            </div>
          ) : (
            <div style={styles.desktopActions}>
              {!isDashboard ? (
                <button
                  onClick={() => navigate("/dashboard", { replace: false })}
                  style={styles.primaryBtn}
                >
                  Dashboard
                </button>
              ) : null}
              <button onClick={logout} style={styles.ghostBtn}>
                Logout
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            style={styles.menuBtn}
          >
            <div style={styles.burger}>
              <span style={{ ...styles.line, ...(open ? styles.lineTopOpen : null) }} />
              <span style={{ ...styles.line, ...(open ? styles.lineMidOpen : null) }} />
              <span style={{ ...styles.line, ...(open ? styles.lineBotOpen : null) }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open ? (
        <div style={styles.mobilePanel}>
          <div style={styles.mobileInner}>
            {!isAuthed ? (
              <>
                <MobileLink to="/" label="Home" close={() => setOpen(false)} />
                <MobileLink to="/login" label="Login" close={() => setOpen(false)} />
                <MobileLink to="/register/user" label="Register User" close={() => setOpen(false)} />
                <MobileLink to="/register/company" label="Register Company" close={() => setOpen(false)} />
              </>
            ) : (
              <>
                <MobileLink to="/dashboard/machines" label="Machines" close={() => setOpen(false)} />
                <MobileLink to="/dashboard/profile" label="Profile" close={() => setOpen(false)} />
                <button onClick={logout} style={styles.mobileDangerBtn}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : null),
      })}
      end={to === "/"}
    >
      {label}
    </NavLink>
  );
}

function MobileLink({ to, label, close }) {
  return (
    <NavLink
      to={to}
      onClick={close}
      style={({ isActive }) => ({
        ...styles.mobileLink,
        ...(isActive ? styles.mobileLinkActive : null),
      })}
      end={to === "/"}
    >
      {label}
      <span style={styles.chev}>›</span>
    </NavLink>
  );
}

const styles = {
  wrap: {
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(255,255,255,0.65)",
    borderBottom: "1px solid rgba(15,23,42,0.08)",
    backdropFilter: "blur(10px)",
  },

  bar: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#0f172a",
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "#4f46e5",
    boxShadow: "0 0 0 6px rgba(79,70,229,0.12)",
  },
  brandText: { fontWeight: 900, letterSpacing: 0.2 },

  desktopNav: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },

  navItem: {
    textDecoration: "none",
    color: "#334155",
    fontWeight: 900,
    fontSize: 13,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(255,255,255,0.7)",
  },
  navItemActive: {
    color: "#1e1b4b",
    background: "rgba(79,70,229,0.12)",
    border: "1px solid rgba(79,70,229,0.20)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.10)",
  },

  right: { display: "flex", alignItems: "center", gap: 10 },

  rolePill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(79,70,229,0.10)",
    color: "#3730a3",
    border: "1px solid rgba(79,70,229,0.22)",
  },

  desktopActions: { display: "flex", alignItems: "center", gap: 10 },

  primaryBtn: {
    height: 36,
    padding: "0 14px",
    borderRadius: 12,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 900,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.20)",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  ghostBtn: {
    height: 36,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontWeight: 900,
    color: "#0f172a",
    whiteSpace: "nowrap",
  },

  menuBtn: {
    display: "none",
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
  },

  burger: { position: "relative", width: 18, height: 14 },
  line: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 999,
    background: "#0f172a",
    transition: "transform 180ms ease, opacity 180ms ease, top 180ms ease",
  },
  lineTopOpen: { top: 6, transform: "rotate(45deg)" },
  lineMidOpen: { top: 6, opacity: 0 },
  lineBotOpen: { top: 6, transform: "rotate(-45deg)" },

  mobilePanel: {
    display: "none",
    borderTop: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
  },
  mobileInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "12px 18px 16px",
    display: "grid",
    gap: 10,
  },
  mobileLink: {
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 900,
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.9)",
    padding: "12px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileLinkActive: {
    background: "rgba(79,70,229,0.12)",
    border: "1px solid rgba(79,70,229,0.20)",
  },
  mobileDangerBtn: {
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(239, 68, 68, 0.22)",
    background: "rgba(239, 68, 68, 0.10)",
    color: "#b91c1c",
    fontWeight: 900,
    cursor: "pointer",
  },
  chev: { color: "#94a3b8", fontWeight: 900 },

  /* Responsive: inline style can't do media queries,
     so we provide a tiny helper: add this CSS snippet to index.css
     (see below). */
};

/**
 * IMPORTANT (styles):
 * Inline styles can't do media queries. To make navbar responsive,
 * add this small CSS to src/index.css:
 *
 * @media (max-width: 860px) {
 *   .desktopNav { display: none !important; }
 *   .desktopActions { display: none !important; }
 *   .menuBtn { display: inline-flex !important; }
 *   .mobilePanel { display: block !important; }
 * }
 *
 * Then add className to the relevant elements OR just use the
 * "data-attr" trick. To keep this file pure, we can optionally
 * refactor to a CSS file next.
 */
