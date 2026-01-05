// src/components/layout/Sidebar.jsx
import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/**
 * Sidebar
 * - Dashboard sidebar navigation
 * - Collapsible (desktop) + mobile drawer toggle button
 * - Shows role (user/company) from localStorage.auth_mode
 * - Logout clears token + auth_mode
 *
 * Usage (recommended inside DashboardLayout.jsx):
 *   <Sidebar />
 *   <main>...</main>
 */

export default function Sidebar({ collapsed: collapsedProp = false }) {
  const navigate = useNavigate();

  const authMode = useMemo(() => localStorage.getItem("auth_mode") || "user", []);
  const roleLabel = authMode === "company" ? "Company" : "User";

  const [collapsed, setCollapsed] = useState(collapsedProp);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_mode");
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile toggle */}
      <div style={styles.mobileBar} className="sbMobileBar">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          style={styles.mobileBtn}
          className="sbMobileBtn"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div style={styles.mobileTitle}>Dashboard</div>
        <div style={styles.rolePill}>{roleLabel}</div>
      </div>

      {/* Desktop sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          ...(collapsed ? styles.sidebarCollapsed : null),
        }}
        className="sbDesktop"
      >
        <SidebarHeader
          roleLabel={roleLabel}
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />

        <nav style={styles.nav}>
          <SideItem to="/dashboard/machines" label="Machines" collapsed={collapsed} />
          <SideItem to="/dashboard/profile" label="Profile" collapsed={collapsed} />
        </nav>

        <div style={styles.footer}>
          {!collapsed ? (
            <div style={styles.note}>
              {authMode === "company"
                ? "Company accounts can create machines."
                : "User accounts can view assigned machines."}
            </div>
          ) : null}

          <button onClick={logout} style={styles.logoutBtn}>
            {collapsed ? "⎋" : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div style={styles.backdrop} className="sbBackdrop" onClick={closeMobile}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerTop}>
              <div style={styles.drawerTitle}>ArminCloud</div>
              <button onClick={closeMobile} style={styles.closeBtn} aria-label="Close sidebar">
                ✕
              </button>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={styles.drawerRole}>{roleLabel}</div>
            </div>

            <nav style={{ ...styles.nav, marginTop: 12 }}>
              <SideItem to="/dashboard/machines" label="Machines" onClick={closeMobile} />
              <SideItem to="/dashboard/profile" label="Profile" onClick={closeMobile} />
            </nav>

            <div style={{ marginTop: "auto" }}>
              <button onClick={logout} style={styles.mobileLogoutBtn}>
                Logout
              </button>
              <div style={styles.mobileNote}>
                {authMode === "company"
                  ? "Company accounts can create machines."
                  : "User accounts can view assigned machines."}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SidebarHeader({ roleLabel, collapsed, onToggle }) {
  return (
    <div style={styles.header}>
      <div style={styles.brandRow}>
        <span style={styles.logoDot} />
        {!collapsed ? <span style={styles.brandText}>ArminCloud</span> : null}
      </div>

      {!collapsed ? <div style={styles.roleText}>{roleLabel}</div> : null}

      <button
        type="button"
        onClick={onToggle}
        style={styles.collapseBtn}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? "›" : "‹"}
      </button>
    </div>
  );
}

function SideItem({ to, label, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        ...styles.item,
        ...(isActive ? styles.itemActive : null),
        ...(collapsed ? styles.itemCollapsed : null),
      })}
      end
    >
      <span style={styles.itemLabel}>{collapsed ? label[0] : label}</span>
      {!collapsed ? <span style={styles.chev}>›</span> : null}
    </NavLink>
  );
}

const styles = {
  /* Mobile bar shown above content (optional) */
  mobileBar: {
    display: "none",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    backdropFilter: "blur(8px)",
    marginBottom: 12,
  },
  mobileBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    fontWeight: 900,
  },
  mobileTitle: { fontWeight: 900 },
  rolePill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(79,70,229,0.10)",
    color: "#3730a3",
    border: "1px solid rgba(79,70,229,0.22)",
    whiteSpace: "nowrap",
  },

  /* Desktop sidebar */
  sidebar: {
    position: "sticky",
    top: 12,
    alignSelf: "start",
    padding: 14,
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    backdropFilter: "blur(8px)",
    minHeight: "calc(100vh - 110px)",
    display: "flex",
    flexDirection: "column",
    width: 260,
    transition: "width 180ms ease",
  },
  sidebarCollapsed: {
    width: 86,
  },

  header: {
    padding: 10,
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(255,255,255,0.9)",
    position: "relative",
  },
  brandRow: { display: "flex", alignItems: "center", gap: 10 },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "#4f46e5",
    boxShadow: "0 0 0 6px rgba(79,70,229,0.12)",
  },
  brandText: { fontWeight: 900, letterSpacing: 0.2 },
  roleText: { marginTop: 6, color: "#64748b", fontSize: 12, fontWeight: 800 },

  collapseBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 900,
  },

  nav: { marginTop: 12, display: "grid", gap: 10 },

  item: {
    textDecoration: "none",
    color: "#0f172a",
    padding: "12px 12px",
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 900,
    transition: "background 180ms ease, border 180ms ease",
  },
  itemActive: {
    background: "rgba(79,70,229,0.12)",
    border: "1px solid rgba(79,70,229,0.22)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.12)",
  },
  itemCollapsed: { justifyContent: "center" },
  itemLabel: { display: "inline-flex", alignItems: "center" },
  chev: { color: "#94a3b8", fontWeight: 900 },

  footer: { marginTop: "auto", paddingTop: 12, display: "grid", gap: 10 },
  note: {
    padding: 12,
    borderRadius: 16,
    border: "1px dashed rgba(15,23,42,0.16)",
    background: "rgba(255,255,255,0.55)",
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.5,
  },
  logoutBtn: {
    height: 40,
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.75)",
    cursor: "pointer",
    fontWeight: 900,
    color: "#0f172a",
  },

  /* Mobile drawer */
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.35)",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    zIndex: 200,
  },
  drawer: {
    width: 320,
    maxWidth: "85vw",
    background: "rgba(255,255,255,0.92)",
    borderRight: "1px solid rgba(15,23,42,0.10)",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(2,6,23,0.20)",
    backdropFilter: "blur(10px)",
  },
  drawerTop: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  drawerTitle: { fontWeight: 900 },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    fontWeight: 900,
  },
  drawerRole: {
    display: "inline-flex",
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(79,70,229,0.10)",
    color: "#3730a3",
    border: "1px solid rgba(79,70,229,0.22)",
    fontWeight: 900,
    fontSize: 12,
    width: "fit-content",
  },
  mobileLogoutBtn: {
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    fontWeight: 900,
  },
  mobileNote: { marginTop: 10, color: "#94a3b8", fontSize: 12, lineHeight: 1.5 },

  /**
   * Responsive helper:
   * Inline styles can't do media queries, so add the CSS below to src/index.css
   * to show the mobile bar and hide desktop sidebar on small screens if desired.
   */
};

/**
 * Add this to src/index.css for responsive behavior:
 *
 * @media (max-width: 860px) {
 *   .sbDesktop { display: none !important; }
 *   .sbMobileBar { display: flex !important; }
 * }
 */
