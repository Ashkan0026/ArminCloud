// src/components/auth/AuthTabs.jsx
import React from "react";

/**
 * AuthTabs
 * - Small reusable tabs for selecting auth mode: "user" or "company"
 *
 * Props:
 * - value: "user" | "company"
 * - onChange: (nextValue) => void
 * - disabled?: boolean
 *
 * Example:
 * <AuthTabs value={mode} onChange={setMode} />
 */

export default function AuthTabs({ value = "user", onChange, disabled = false }) {
  const isUser = value === "user";
  const isCompany = value === "company";

  return (
    <div style={styles.wrap} role="tablist" aria-label="Login type">
      <button
        type="button"
        role="tab"
        aria-selected={isUser}
        disabled={disabled}
        onClick={() => onChange?.("user")}
        style={{
          ...styles.tab,
          ...(isUser ? styles.active : null),
          ...(disabled ? styles.disabled : null),
        }}
      >
        User
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={isCompany}
        disabled={disabled}
        onClick={() => onChange?.("company")}
        style={{
          ...styles.tab,
          ...(isCompany ? styles.active : null),
          ...(disabled ? styles.disabled : null),
        }}
      >
        Company
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    padding: 10,
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.85)",
  },
  tab: {
    height: 40,
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.10)",
    background: "#ffffff",
    fontWeight: 900,
    color: "#334155",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(2,6,23,0.04)",
    transition: "transform 140ms ease, box-shadow 140ms ease",
  },
  active: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.22)",
  },
  disabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
};
