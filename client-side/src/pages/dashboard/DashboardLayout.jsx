// src/pages/dashboard/DashboardLayout.jsx
import React, { useMemo } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const authMode = useMemo(() => localStorage.getItem("auth_mode") || "user", []);
  const displayRole = authMode === "company" ? "Company" : "User";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_mode");
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <header style={styles.topbar}>
        <Link to="/" style={styles.brand}>
          <span style={styles.logoDot} />
          <span style={styles.brandText}>ArminCloud</span>
        </Link>

        <div style={styles.topbarRight}>
          <div style={styles.rolePill}>{displayRole}</div>
          <button onClick={logout} style={styles.ghostBtn}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.shell}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.sidebarTitle}>Dashboard</div>
            <div style={styles.sidebarSub}>Manage your resources</div>
          </div>

          <nav style={styles.nav}>
            <SidebarItem to="/dashboard/machines" label="Machines" />
            <SidebarItem to="/dashboard/profile" label="Profile" />
          </nav>

          <div style={styles.sidebarFooter}>
            <div style={styles.miniNote}>
              {authMode === "company"
                ? "Company accounts can create machines."
                : "User accounts can view assigned machines."}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ to, label }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : null),
      })}
      end
    >
      <span>{label}</span>
      <span style={styles.chev}>›</span>
    </NavLink>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 10%, #eef2ff 0%, #ffffff 55%, #fafafa 100%)",
    color: "#0f172a",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },

  topbar: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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

  topbarRight: { display: "flex", alignItems: "center", gap: 10 },
  rolePill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(79,70,229,0.10)",
    color: "#3730a3",
    border: "1px solid rgba(79,70,229,0.22)",
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
  },

  shell: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 18px 24px",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 14,
    alignItems: "start",
  },

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
  },
  sidebarHeader: {
    padding: 10,
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(255,255,255,0.9)",
  },
  sidebarTitle: { fontWeight: 900, fontSize: 14 },
  sidebarSub: { marginTop: 4, color: "#64748b", fontSize: 12, lineHeight: 1.4 },

  nav: { marginTop: 12, display: "grid", gap: 10 },
  navItem: {
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
  },
  navItemActive: {
    background: "rgba(79,70,229,0.12)",
    border: "1px solid rgba(79,70,229,0.22)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.12)",
  },
  chev: { color: "#94a3b8", fontWeight: 900 },

  sidebarFooter: { marginTop: "auto", paddingTop: 12 },
  miniNote: {
    padding: 12,
    borderRadius: 16,
    border: "1px dashed rgba(15,23,42,0.16)",
    background: "rgba(255,255,255,0.55)",
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.5,
  },

  main: {
    padding: 14,
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    backdropFilter: "blur(8px)",
    minHeight: "calc(100vh - 110px)",
  },
};
