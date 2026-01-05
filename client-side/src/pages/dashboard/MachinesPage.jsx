// src/pages/dashboard/MachinesPage.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * MachinesPage (MVP)
 * - Lists machines
 * - Company can add machines (memorySize MB, diskSize GB)
 * - Uses mock API for now (replace with real services/machines.service.js)
 *
 * Assumptions:
 * - localStorage.auth_mode = "company" | "user"
 * - later you'll wire:
 *    GET  /machines/get
 *    POST /machines/create
 *    PATCH /machines/:id/assign
 */

export default function MachinesPage() {
  const authMode = useMemo(() => localStorage.getItem("auth_mode") || "user", []);
  const isCompany = authMode === "company";

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [memorySize, setMemorySize] = useState("");
  const [diskSize, setDiskSize] = useState("");
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  // Fetch machines on load
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setPageError("");
      try {
        // TODO replace with real API call
        // const data = await machinesService.getMachines()
        const data = await mockGetMachines();
        if (mounted) setMachines(data);
      } catch (e) {
        if (mounted) setPageError(e?.message || "Failed to load machines.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    setPageError("");
    try {
      const data = await mockGetMachines();
      setMachines(data);
    } catch (e) {
      setPageError(e?.message || "Failed to load machines.");
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    const mem = Number(memorySize);
    const disk = Number(diskSize);

    if (!Number.isFinite(mem) || mem <= 0) return setFormError("Memory must be a positive number (MB).");
    if (!Number.isFinite(disk) || disk <= 0) return setFormError("Disk must be a positive number (GB).");

    try {
      setCreating(true);

      // TODO replace with real API call:
      // const created = await machinesService.createMachine({ memorySize: mem, diskSize: disk })
      const created = await mockCreateMachine({ memorySize: mem, diskSize: disk });

      setMachines((prev) => [created, ...prev]);
      setMemorySize("");
      setDiskSize("");
      setShowForm(false);
    } catch (e2) {
      setFormError(e2?.message || "Failed to create machine.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.h2}>Machines</h2>
          <div style={styles.sub}>
            {isCompany ? "Create and manage virtual machines." : "View machines assigned to you."}
          </div>
        </div>

        <div style={styles.headerActions}>
          <button onClick={refresh} style={styles.ghostBtn} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          {isCompany ? (
            <button onClick={() => setShowForm((s) => !s)} style={styles.primaryBtn}>
              {showForm ? "Close" : "Add VM"}
            </button>
          ) : null}
        </div>
      </div>

      {/* Company create form */}
      {isCompany && showForm ? (
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Create a new VM</div>
          <form onSubmit={onCreate} style={styles.formRow}>
            <label style={styles.label}>
              Memory (MB)
              <input
                value={memorySize}
                onChange={(e) => setMemorySize(e.target.value)}
                type="number"
                min="1"
                placeholder="4096"
                style={styles.input}
              />
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
              />
            </label>

            <button
              type="submit"
              disabled={creating}
              style={{ ...styles.primaryBtn, height: 42, alignSelf: "end", opacity: creating ? 0.75 : 1 }}
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>

          {formError ? <div style={styles.error}>{formError}</div> : null}

          <div style={styles.note}>
            Tip: Later we can add assignment UI (PATCH <code>/machines/:id/assign</code>).
          </div>
        </div>
      ) : null}

      {/* Content */}
      {pageError ? <div style={styles.error}>{pageError}</div> : null}

      {loading ? (
        <SkeletonList />
      ) : machines.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyTitle}>No machines found</div>
          <div style={styles.emptySub}>
            {isCompany ? "Create your first machine using the “Add VM” button." : "When a machine is assigned, it will show up here."}
          </div>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <div style={styles.tableHead}>
            <div style={styles.th}>ID</div>
            <div style={styles.th}>Memory</div>
            <div style={styles.th}>Disk</div>
            <div style={styles.th}>Status</div>
          </div>

          <div style={styles.rows}>
            {machines.map((m) => (
              <div key={m.id} style={styles.row}>
                <div style={styles.tdMono}>{m.id}</div>
                <div style={styles.td}>
                  <b>{m.memorySize}</b> MB
                </div>
                <div style={styles.td}>
                  <b>{m.diskSize}</b> GB
                </div>
                <div style={styles.td}>
                  <StatusPill status={m.status || "ready"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const isReady = s === "ready";
  return (
    <span
      style={{
        ...styles.pill,
        background: isReady ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
        color: isReady ? "#15803d" : "#92400e",
        border: isReady ? "1px solid rgba(34,197,94,0.22)" : "1px solid rgba(234,179,8,0.22)",
      }}
    >
      {isReady ? "Ready" : "Pending"}
    </span>
  );
}

function SkeletonList() {
  return (
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={styles.skeletonRow}>
          <div style={styles.skelBox} />
          <div style={styles.skelBox} />
          <div style={styles.skelBox} />
          <div style={styles.skelBoxSmall} />
        </div>
      ))}
    </div>
  );
}

/* -------------------- MOCK API (replace later) -------------------- */
let _mockMachines = [
  { id: 101, memorySize: 2048, diskSize: 40, status: "ready" },
  { id: 102, memorySize: 4096, diskSize: 80, status: "ready" },
  { id: 103, memorySize: 8192, diskSize: 160, status: "pending" },
];

async function mockGetMachines() {
  await sleep(450);
  // newest first
  return [..._mockMachines].sort((a, b) => b.id - a.id);
}

async function mockCreateMachine({ memorySize, diskSize }) {
  await sleep(500);

  const nextId = (_mockMachines.reduce((mx, m) => Math.max(mx, m.id), 100) || 100) + 1;
  const created = { id: nextId, memorySize, diskSize, status: "ready" };

  _mockMachines = [created, ..._mockMachines];
  return created;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* -------------------- STYLES -------------------- */
const styles = {
  h2: { margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: -0.2 },
  sub: { marginTop: 6, color: "#64748b", fontSize: 13, lineHeight: 1.4 },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  headerActions: { display: "flex", gap: 10, alignItems: "center" },

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

  panel: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.05)",
  },
  panelTitle: { fontWeight: 900, fontSize: 13 },

  formRow: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: 10,
    alignItems: "end",
  },
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

  note: { marginTop: 10, color: "#94a3b8", fontSize: 12, lineHeight: 1.5 },

  error: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    background: "rgba(239, 68, 68, 0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239, 68, 68, 0.22)",
    fontWeight: 900,
    fontSize: 13,
  },

  empty: {
    marginTop: 14,
    padding: 18,
    borderRadius: 18,
    border: "1px dashed rgba(15,23,42,0.16)",
    background: "rgba(255,255,255,0.6)",
  },
  emptyTitle: { fontWeight: 900, fontSize: 14 },
  emptySub: { marginTop: 6, color: "#64748b", fontSize: 13, lineHeight: 1.5 },

  tableWrap: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,0.08)",
    overflow: "hidden",
    background: "rgba(255,255,255,0.85)",
  },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 1fr 140px",
    gap: 10,
    padding: "12px 14px",
    borderBottom: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(248,250,252,0.9)",
  },
  th: { fontSize: 12, fontWeight: 900, color: "#475569" },

  rows: { display: "grid" },
  row: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 1fr 140px",
    gap: 10,
    padding: "12px 14px",
    borderBottom: "1px solid rgba(15,23,42,0.06)",
    alignItems: "center",
  },
  td: { fontSize: 13, color: "#0f172a" },
  tdMono: {
    fontSize: 13,
    fontWeight: 900,
    color: "#0f172a",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  pill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    width: "fit-content",
  },

  skeletonRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 1fr 140px",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(255,255,255,0.6)",
  },
  skelBox: {
    height: 14,
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(226,232,240,0.6), rgba(226,232,240,0.9), rgba(226,232,240,0.6))",
  },
  skelBoxSmall: {
    height: 14,
    width: 80,
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(226,232,240,0.6), rgba(226,232,240,0.9), rgba(226,232,240,0.6))",
    justifySelf: "start",
  },
};
