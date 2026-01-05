import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterCompanyPage() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState(""); // optional but useful for login later
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!companyName.trim()) return setError("Please enter company name.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email.");
    if (!password.trim() || password.length < 4) return setError("Password must be at least 4 characters.");

    try {
      setLoading(true);

      // TODO: Replace with real API call:
      // await authService.registerCompany({ name: companyName, email, password })
      await mockRegister({ companyName, email, password });

      navigate("/login?as=company", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.nav}>
        <Link to="/" style={styles.brand}>
          <span style={styles.logoDot} />
          <span style={styles.brandText}>ArminCloud</span>
        </Link>

        <div style={styles.navRight}>
          <Link to="/login?as=company" style={styles.linkBtn}>
            Login
          </Link>
          <Link to="/register/user" style={styles.linkBtn}>
            Register User
          </Link>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.shell}>
          <div style={styles.leftPane}>
            <h1 style={styles.h1}>Register your company</h1>
            <p style={styles.p}>
              Company accounts can create virtual machines with specific memory and disk settings and manage assignments.
            </p>

            <div style={styles.infoBox}>
              <div style={styles.infoTitle}>Company features</div>
              <ul style={styles.ul}>
                <li>Create machines (memory/disk)</li>
                <li>View and manage machines</li>
                <li>(Optional) Assign machines to users</li>
              </ul>
            </div>

            <div style={styles.helpBox}>
              <div style={styles.helpTitle}>Just need a user account?</div>
              <div style={styles.helpLinks}>
                <Link to="/register/user" style={styles.helpLink}>
                  Register User
                </Link>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>Company Registration</div>
              <div style={styles.cardSubtitle}>Create a company account to manage machines.</div>
            </div>

            <form onSubmit={onSubmit} style={styles.form}>
              <label style={styles.label}>
                Company name
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  type="text"
                  placeholder="ArminCloud LLC"
                  style={styles.input}
                  autoComplete="organization"
                />
              </label>

              <label style={styles.label}>
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="company@email.com"
                  style={styles.input}
                  autoComplete="email"
                />
              </label>

              <label style={styles.label}>
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  style={styles.input}
                  autoComplete="new-password"
                />
              </label>

              {error ? <div style={styles.error}>{error}</div> : null}

              <button type="submit" disabled={loading} style={{ ...styles.primaryBtn, opacity: loading ? 0.75 : 1 }}>
                {loading ? "Creating company..." : "Create company"}
              </button>

              <div style={styles.smallNote}>
                Already have an account?{" "}
                <Link to="/login?as=company" style={styles.inlineLink}>
                  Login as company
                </Link>
              </div>

              <div style={styles.extraNote}>
                Note: your current backend Company model only has <b>name</b>. For real company login, you’ll likely add
                an email/password table or link company to a user/role.
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

async function mockRegister() {
  await new Promise((r) => setTimeout(r, 550));
  return true;
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
  brand: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#0f172a" },
  logoDot: { width: 12, height: 12, borderRadius: 999, background: "#4f46e5", boxShadow: "0 0 0 6px rgba(79,70,229,0.12)" },
  brandText: { fontWeight: 800, letterSpacing: 0.2 },
  navRight: { display: "flex", gap: 10, alignItems: "center" },
  linkBtn: {
    textDecoration: "none",
    color: "#334155",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(255,255,255,0.7)",
  },
  main: { maxWidth: 1080, margin: "0 auto", padding: "0 18px 24px" },
  shell: { marginTop: 18, display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: 18, alignItems: "stretch" },
  leftPane: {
    padding: 22,
    borderRadius: 20,
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    backdropFilter: "blur(8px)",
  },
  h1: { margin: 0, fontSize: 38, lineHeight: 1.1, letterSpacing: -0.6 },
  p: { marginTop: 12, color: "#475569", lineHeight: 1.6, fontSize: 16 },
  infoBox: { marginTop: 16, padding: 14, borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,0.9)" },
  infoTitle: { fontWeight: 900, fontSize: 13, marginBottom: 10 },
  ul: { margin: 0, paddingLeft: 18, color: "#475569", lineHeight: 1.7, fontSize: 14 },
  helpBox: { marginTop: 12, padding: 14, borderRadius: 18, border: "1px dashed rgba(15,23,42,0.16)", background: "rgba(255,255,255,0.5)" },
  helpTitle: { fontWeight: 900, fontSize: 13 },
  helpLinks: { marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  helpLink: { color: "#4f46e5", fontWeight: 900, textDecoration: "none" },

  card: { padding: 18, borderRadius: 20, border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,0.9)", boxShadow: "0 10px 30px rgba(2,6,23,0.06)" },
  cardHeader: { marginBottom: 12 },
  cardTitle: { fontWeight: 900, fontSize: 16 },
  cardSubtitle: { marginTop: 6, color: "#64748b", fontSize: 13 },
  form: { display: "grid", gap: 12 },
  label: { display: "grid", gap: 8, fontWeight: 900, fontSize: 13, color: "#0f172a" },
  input: { height: 42, padding: "0 12px", borderRadius: 12, border: "1px solid rgba(15,23,42,0.12)", outline: "none", background: "#ffffff", fontSize: 14 },
  error: { padding: 10, borderRadius: 12, background: "rgba(239, 68, 68, 0.10)", color: "#b91c1c", border: "1px solid rgba(239, 68, 68, 0.22)", fontWeight: 900, fontSize: 13 },
  primaryBtn: { height: 44, borderRadius: 12, background: "#4f46e5", color: "#fff", fontWeight: 900, border: "1px solid rgba(15,23,42,0.06)", boxShadow: "0 10px 30px rgba(79,70,229,0.20)", cursor: "pointer" },
  smallNote: { marginTop: 6, color: "#94a3b8", fontSize: 12, lineHeight: 1.4 },
  inlineLink: { color: "#4f46e5", fontWeight: 900, textDecoration: "none" },
  extraNote: { marginTop: 10, color: "#64748b", fontSize: 12, lineHeight: 1.5 },
};
