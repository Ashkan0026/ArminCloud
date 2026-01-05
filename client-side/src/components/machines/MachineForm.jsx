// src/components/machines/MachineForm.jsx
import React, { useMemo, useState } from "react";

/**
 * MachineForm (Reusable)
 * - Creates a VM with memorySize (MB) and diskSize (GB)
 * - Validates inputs
 * - Calls onCreate({ memorySize, diskSize }) provided by parent
 *
 * Props:
 * - onCreate: async ({ memorySize, diskSize }) => void
 * - onCancel?: () => void
 * - initialValues?: { memorySize?: number|string, diskSize?: number|string }
 * - submitLabel?: string
 * - disabled?: boolean
 *
 * Example:
 * <MachineForm
 *   onCreate={(payload) => machinesService.createMachine(payload)}
 *   onCancel={() => setOpen(false)}
 * />
 */

export default function MachineForm({
  onCreate,
  onCancel,
  initialValues,
  submitLabel = "Create",
  disabled = false,
}) {
  const [memorySize, setMemorySize] = useState(
    initialValues?.memorySize ?? ""
  );
  const [diskSize, setDiskSize] = useState(initialValues?.diskSize ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const authMode = useMemo(() => localStorage.getItem("auth_mode") || "user", []);
  const isCompany = authMode === "company";

  const validate = () => {
    const mem = Number(memorySize);
    const disk = Number(diskSize);

    if (!Number.isFinite(mem) || mem <= 0) return "Memory must be a positive number (MB).";
    if (!Number.isFinite(disk) || disk <= 0) return "Disk must be a positive number (GB).";

    // Optional sanity bounds (edit as you like)
    if (mem < 128) return "Memory seems too low. Use at least 128 MB.";
    if (disk < 5) return "Disk seems too low. Use at least 5 GB.";

    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isCompany) {
      setError("Only company accounts can create machines.");
      return;
    }

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setSubmitting(true);
      await onCreate?.({
        memorySize: Number(memorySize),
        diskSize: Number(diskSize),
      });

      // Reset on success
      setMemorySize("");
      setDiskSize("");
    } catch (err) {
      setError(err?.message || "Failed to create machine.");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !disabled && !submitting && isCompany;

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.title}>Create VM</div>
          <div style={styles.sub}>
            Set memory in <b>MB</b> and disk in <b>GB</b>.
          </div>
        </div>

        {onCancel ? (
          <button type="button" onClick={onCancel} style={styles.ghostBtn}>
            Cancel
          </button>
        ) : null}
      </div>

      {!isCompany ? (
        <div style={styles.warn}>
          You’re logged in as a <b>User</b>. Switch to a <b>Company</b> account to create machines.
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={styles.form}>
        <label style={styles.label}>
          Memory (MB)
          <input
            value={memorySize}
            onChange={(e) => setMemorySize(e.target.value)}
            type="number"
            min="1"
            placeholder="4096"
            style={styles.input}
            disabled={disabled || submitting || !isCompany}
          />
          <span style={styles.hint}>Example: 1024, 2048, 4096</span>
        </label>

        <label style={styles.label}>
          Disk (GB)
          <input
            value={diskSize}
            onChange={(e) => setDiskSize(e.target.value)}
            type="number"
            min="1"
            placeholder="80"
            style={styles.input}
            disabled={disabled || submitting || !isCompany}
          />
          <span style={styles.hint}>Example: 40, 80, 160</span>
        </label>

        {error ? <div style={styles.error}>{error}</div> : null}

        <div style={styles.actions}>
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              ...styles.primaryBtn,
              opacity: canSubmit ? 1 : 0.65,
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Creating..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: {
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.05)",
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  title: { fontWeight: 900, fontSize: 14 },
  sub: { marginTop: 6, color: "#64748b", fontSize: 12, lineHeight: 1.4 },

  form: { marginTop: 12, display: "grid", gap: 12 },
  label: { display: "grid", gap: 8, fontWeight: 900, fontSize: 12, color: "#0f172a" },
  input: {
    height: 42,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    outline: "none",
    background: "#fff",
    fontSize: 14,
  },
  hint: { color: "#94a3b8", fontSize: 12, fontWeight: 700 },

  actions: { display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end", marginTop: 4 },

  primaryBtn: {
    height: 42,
    padding: "0 14px",
    borderRadius: 12,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 900,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 10px 30px rgba(79,70,229,0.20)",
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

  error: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(239, 68, 68, 0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239, 68, 68, 0.22)",
    fontWeight: 900,
    fontSize: 13,
  },
  warn: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    background: "rgba(234,179,8,0.12)",
    color: "#92400e",
    border: "1px solid rgba(234,179,8,0.22)",
    fontWeight: 900,
    fontSize: 13,
  },
};
