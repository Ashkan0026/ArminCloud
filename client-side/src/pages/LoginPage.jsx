// src/pages/LoginPage.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../services/auth.service";

/**
 * LoginPage
 * - Toggle login type: user or company
 * - Validates basic input
 * - Uses real authService login methods (no mock token)
 * - Redirects to intended page if ProtectedRoute set `state.from`
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const initialMode = useMemo(() => {
    const m = params.get("as");
    return m === "company" ? "company" : "user";
  }, [params]);

  const [mode, setMode] = useState(initialMode); // "user" | "company"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/dashboard";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // REAL login calls (auth.service.js persists token + auth_mode)
      if (mode === "company") {
        await authService.loginCompany({ email: email.trim(), password });
      } else {
        await authService.loginUser({ email: email.trim(), password });
      }

      // If user tried opening a protected route, go there; otherwise dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modeLabel = mode === "company" ? "Company" : "User";

  return (
    <div style={styles.page}>
      <header style={styles.nav}>
        <Link to="/" style={styles.brand}>
          <span style={styles.logoDot} />
          <span style={styles.brandText}>ArminCloud</span>
        </Link>

        <div style={styles.navRight}>
          <Link to="/register/user" style={styles.linkBtn}>
            Register User
          </Link>
          <Link to="/register/company" style={styles.linkBtn}>
            Register Company
          </Link>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.shell}>
          <div style={styles.leftPane}>
            <h1 style={styles.h1}>Welcome back</h1>
            <p style={styles.p}>
              Log in as a <b>User</b> or <b>Company</b>. Companies can create machines; users can access assigned machines.
            </p>

            <div style={styles.modeBox}>
              <div style={styles.modeTitle}>Login as</div>
              <div style={styles.modeRow}>
                <button
                  type="button"
                  onClick={() => setMode("user")}
                  style={{
                    ...styles.modeBtn,
                    ...(mode === "user" ? styles.modeBtnActive : null),
                  }}
                  disabled={loading}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setMode("company")}
                  style={{
                    ...styles.modeBtn,
                    ...(mode === "company" ? styles.modeBtnActive : null),
                  }}
                  disabled={loading}
                >
                  Company
                </button>
              </div>

              <div style={styles.modeHint}>
                {mode === "company"
                  ? "Company accounts can add virtual machines."
                  : "User accounts can view and manage assigned machines."}
              </div>
            </div>

            <div style={styles.helpBox}>
              <div style={styles.helpTitle}>No account?</div>
              <div style={styles.helpLinks}>
                <Link to="/register/user" style={styles.helpLink}>
                  Create a user
                </Link>
                <span style={styles.dotSep}>•</span>
                <Link to="/register/company" style={styles.helpLink}>
                  Create a company
                </Link>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>{modeLabel} Login</div>
              <div style={styles.cardSubtitle}>Use your credentials to continue.</div>
            </div>

            <form onSubmit={onSubmit} style={styles.form}>
              <label style={styles.label}>
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder={mode === "company" ? "company@email.com" : "user@email.com"}
                  style={styles.input}
                  autoComplete="email"
                  disabled={loading}
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
                  autoComplete="current-password"
                  disabled={loading}
                />
              </label>

              {error ? <div style={styles.error}>{error}</div> : null}

              <button type="submit" disabled={loading} style={{ ...styles.primaryBtn, opacity: loading ? 0.75 : 1 }}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div style={styles.smallNote}>
                If login fails, confirm your backend endpoints match <code>auth.service.js</code>.
              </div>
            </form>
          </div>
        </div>
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
  brand: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#0f172a" },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    background: "#4f46e5",
    boxShadow: "0 0 0 6px rgba(79,70,229,0.12)",
  },
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
  shell: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "1fr 0.95fr",
    gap: 18,
    alignItems: "stretch",
  },
  leftPane: {
    padding: 22,
    borderRadius: 20,
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    backdropFilter: "blur(8px)",
  },
  h1: { margin: 0, fontSize: 40, lineHeight: 1.1, letterSpacing: -0.6 },
  p: { marginTop: 12, color: "#475569", lineHeight: 1.6, fontSize: 16 },
  modeBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.9)",
  },
  modeTitle: { fontWeight: 800, fontSize: 13, color: "#0f172a" },
  modeRow: { display: "flex", gap: 10, marginTop: 10 },
  modeBtn: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 14,
    cursor: "pointer",
    border: "1px solid rgba(15,23,42,0.10)",
    background: "#ffffff",
    fontWeight: 800,
    color: "#334155",
  },
  modeBtnActive: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.22)",
  },
  modeHint: { marginTop: 10, color: "#64748b", fontSize: 13, lineHeight: 1.4 },
  helpBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 18,
    border: "1px dashed rgba(15,23,42,0.16)",
    background: "rgba(255,255,255,0.5)",
  },
  helpTitle: { fontWeight: 800, fontSize: 13 },
  helpLinks: { marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  helpLink: { color: "#4f46e5", fontWeight: 800, textDecoration: "none" },
  dotSep: { color: "#94a3b8" },
  card: {
    padding: 18,
    borderRadius: 20,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
  },
  cardHeader: { marginBottom: 12 },
  cardTitle: { fontWeight: 900, fontSize: 16 },
  cardSubtitle: { marginTop: 6, color: "#64748b", fontSize: 13 },
  form: { display: "grid", gap: 12 },
  label: { display: "grid", gap: 8, fontWeight: 800, fontSize: 13, color: "#0f172a" },
  input: {
    height: 42,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    outline: "none",
    background: "#ffffff",
    fontSize: 14,
  },
  error: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(239, 68, 68, 0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239, 68, 68, 0.22)",
    fontWeight: 800,
    fontSize: 13,
  },
  primaryBtn: {
    height: 44,
    borderRadius: 12,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 900,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.20)",
    cursor: "pointer",
  },
  smallNote: { marginTop: 6, color: "#94a3b8", fontSize: 12, lineHeight: 1.4 },
};
