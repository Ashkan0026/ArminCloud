import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={styles.page}>
      <header style={styles.nav}>
        <div style={styles.brand}>
          <span style={styles.logoDot} />
          <span style={styles.brandText}>ArminCloud</span>
        </div>

        <div style={styles.navActions}>
          <Link to="/login" style={styles.linkBtn}>
            Login
          </Link>
          <Link to="/register/user" style={{ ...styles.primaryBtn, textDecoration: "none" }}>
            Register (User)
          </Link>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroLeft}>
            <h1 style={styles.h1}>Provision Virtual Machines, simply.</h1>
            <p style={styles.p}>
              Manage companies, users, and virtual machines from one dashboard.
              Create machines with specific memory and disk configurations and
              assign them when needed.
            </p>

            <div style={styles.ctaRow}>
              <Link to="/login" style={{ ...styles.primaryBtn, textDecoration: "none" }}>
                Get started
              </Link>
              <Link to="/register/company" style={styles.secondaryBtn}>
                Register a company
              </Link>
            </div>

            <div style={styles.badgesRow}>
              <div style={styles.badge}>
                <span style={styles.badgeTitle}>User</span>
                <span style={styles.badgeText}>Register & access machines</span>
              </div>
              <div style={styles.badge}>
                <span style={styles.badgeTitle}>Company</span>
                <span style={styles.badgeText}>Create & manage VMs</span>
              </div>
              <div style={styles.badge}>
                <span style={styles.badgeTitle}>Fast</span>
                <span style={styles.badgeText}>Clean UI + API-first</span>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>Example VM</div>
                <div style={styles.pill}>Ready</div>
              </div>

              <div style={styles.kvGrid}>
                <div style={styles.kv}>
                  <div style={styles.k}>Memory</div>
                  <div style={styles.v}>4096 MB</div>
                </div>
                <div style={styles.kv}>
                  <div style={styles.k}>Disk</div>
                  <div style={styles.v}>80 GB</div>
                </div>
                <div style={styles.kv}>
                  <div style={styles.k}>Owner</div>
                  <div style={styles.v}>Company A</div>
                </div>
                <div style={styles.kv}>
                  <div style={styles.k}>Assigned</div>
                  <div style={styles.v}>User X</div>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.miniNote}>
                  Tip: Companies can create machines, users can view assigned machines.
                </div>
              </div>
            </div>

            <div style={styles.softPanel}>
              <div style={styles.softTitle}>What you can do</div>
              <ul style={styles.ul}>
                <li>Register as a user or company</li>
                <li>Login and access your dashboard</li>
                <li>Create machines with memory/disk</li>
                <li>(Optional) Assign machines to users</li>
              </ul>
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          <span style={styles.footerText}>© {new Date().getFullYear()} ArminCloud</span>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(1200px 600px at 20% 10%, #eef2ff 0%, #ffffff 55%, #fafafa 100%)",
    color: "#0f172a",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  nav: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: "18px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "#4f46e5",
    boxShadow: "0 0 0 6px rgba(79,70,229,0.12)",
  },
  brandText: { fontWeight: 800, letterSpacing: 0.2 },
  navActions: { display: "flex", gap: 10, alignItems: "center" },
  linkBtn: {
    textDecoration: "none",
    color: "#334155",
    padding: "10px 12px",
    borderRadius: 10,
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 12,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 700,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.20)",
    cursor: "pointer",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.9)",
    color: "#0f172a",
    fontWeight: 700,
    border: "1px solid rgba(15,23,42,0.10)",
    textDecoration: "none",
    cursor: "pointer",
  },
  main: { maxWidth: 1080, margin: "0 auto", padding: "0 18px 24px" },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 18,
    alignItems: "start",
    paddingTop: 24,
  },
  heroLeft: {
    padding: 22,
    borderRadius: 20,
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    backdropFilter: "blur(8px)",
  },
  heroRight: { display: "grid", gap: 12 },
  h1: { margin: 0, fontSize: 42, lineHeight: 1.1, letterSpacing: -0.6 },
  p: { marginTop: 12, marginBottom: 0, color: "#475569", lineHeight: 1.6, fontSize: 16 },
  ctaRow: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  badgesRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 18,
  },
  badge: {
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.9)",
  },
  badgeTitle: { display: "block", fontWeight: 800, fontSize: 13 },
  badgeText: { display: "block", marginTop: 4, color: "#64748b", fontSize: 13 },
  card: {
    padding: 16,
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontWeight: 800, fontSize: 14 },
  pill: {
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.12)",
    color: "#15803d",
    border: "1px solid rgba(34,197,94,0.22)",
  },
  kvGrid: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  kv: { padding: 12, borderRadius: 14, background: "#f8fafc", border: "1px solid rgba(15,23,42,0.06)" },
  k: { color: "#64748b", fontSize: 12, fontWeight: 700 },
  v: { marginTop: 4, fontSize: 14, fontWeight: 800, color: "#0f172a" },
  cardFooter: { marginTop: 12 },
  miniNote: { color: "#64748b", fontSize: 12, lineHeight: 1.5 },
  softPanel: {
    padding: 16,
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.7)",
  },
  softTitle: { fontWeight: 800, marginBottom: 10 },
  ul: { margin: 0, paddingLeft: 18, color: "#475569", lineHeight: 1.7, fontSize: 14 },
  footer: { marginTop: 22, padding: "16px 4px" },
  footerText: { color: "#94a3b8", fontSize: 13 },
};
