// src/components/auth/LoginForm.jsx
import React, { useState } from "react";

/**
 * LoginForm (Reusable)
 * - Controlled internally (email/password)
 * - Basic validation + loading/error states
 * - Calls onSubmit({ email, password }) and expects it to return/resolve success
 *
 * Props:
 * - mode: "user" | "company" (only used for labels/placeholders)
 * - onSubmit: async ({ email, password }) => void
 * - loading?: boolean (optional external control)
 * - submitLabel?: string
 * - initialEmail?: string
 * - initialPassword?: string
 * - footer?: ReactNode (optional extra area under button)
 */

export default function LoginForm({
  mode = "user",
  onSubmit,
  loading: loadingProp,
  submitLabel = "Login",
  initialEmail = "",
  initialPassword = "",
  footer = null,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);

  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");

  const loading = Boolean(loadingProp ?? localLoading);
  const modeLabel = mode === "company" ? "Company" : "User";

  const validate = () => {
    if (!email.trim()) return "Please enter your email.";
    if (!email.includes("@")) return "Please enter a valid email address.";
    if (!password.trim()) return "Please enter your password.";
    if (password.length < 4) return "Password must be at least 4 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    try {
      if (loadingProp === undefined) setLocalLoading(true);
      await onSubmit?.({ email: email.trim(), password });
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      if (loadingProp === undefined) setLocalLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>{modeLabel} Login</div>
        <div style={styles.cardSubtitle}>Use your credentials to continue.</div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
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

        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.primaryBtn, opacity: loading ? 0.75 : 1 }}
        >
          {loading ? "Logging in..." : submitLabel}
        </button>

        {footer ? <div style={styles.footerArea}>{footer}</div> : null}
      </form>
    </div>
  );
}

const styles = {
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
  label: { display: "grid", gap: 8, fontWeight: 900, fontSize: 13, color: "#0f172a" },
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
    fontWeight: 900,
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

  footerArea: { marginTop: 6 },
};
