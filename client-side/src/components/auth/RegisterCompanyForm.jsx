// src/components/auth/RegisterCompanyForm.jsx
import React, { useState } from "react";

/**
 * RegisterCompanyForm (Reusable)
 * - Controlled internally (companyName/email/password)
 * - Basic validation + loading/error states
 * - Calls onSubmit({ name, email, password }) and expects it to resolve success
 *
 * Props:
 * - onSubmit: async ({ name, email, password }) => void
 * - loading?: boolean (optional external control)
 * - submitLabel?: string
 * - initialValues?: { name?: string, email?: string, password?: string }
 * - footer?: ReactNode
 */

export default function RegisterCompanyForm({
  onSubmit,
  loading: loadingProp,
  submitLabel = "Create company",
  initialValues,
  footer = null,
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [password, setPassword] = useState(initialValues?.password ?? "");

  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");

  const loading = Boolean(loadingProp ?? localLoading);

  const validate = () => {
    if (!name.trim()) return "Please enter your company name.";
    if (!email.trim()) return "Please enter your email.";
    if (!email.includes("@")) return "Please enter a valid email address.";
    if (!password.trim()) return "Please enter a password.";
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

      await onSubmit?.({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      if (loadingProp === undefined) setLocalLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>Company Registration</div>
        <div style={styles.cardSubtitle}>Create a company account to manage machines.</div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Company name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="ArminCloud LLC"
            style={styles.input}
            autoComplete="organization"
            disabled={loading}
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
            autoComplete="new-password"
            disabled={loading}
          />
          <span style={styles.hint}>Use at least 4 characters (you can strengthen this later).</span>
        </label>

        {error ? <div style={styles.error}>{error}</div> : null}

        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.primaryBtn, opacity: loading ? 0.75 : 1 }}
        >
          {loading ? "Creating..." : submitLabel}
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
  hint: { color: "#94a3b8", fontSize: 12, fontWeight: 700 },

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
