// src/components/machines/MachinesTable.jsx
import React from "react";

/**
 * MachinesTable (Reusable)
 * - Displays machines in a clean table-like layout
 * - Optional actions per row (e.g., Assign / Delete) via renderActions
 *
 * Props:
 * - machines: Array<{ id, memorySize, diskSize, status? }>
 * - loading?: boolean
 * - error?: string
 * - emptyTitle?: string
 * - emptySubtitle?: string
 * - renderActions?: (machine) => ReactNode
 *
 * Example:
 * <MachinesTable
 *   machines={machines}
 *   loading={loading}
 *   error={error}
 *   renderActions={(m) => <button onClick={() => assign(m.id)}>Assign</button>}
 * />
 */

export default function MachinesTable({
  machines,
  loading = false,
  error = "",
  emptyTitle = "No machines found",
  emptySubtitle = "Create your first machine to see it here.",
  renderActions,
}) {
  if (error) return <div style={styles.error}>{error}</div>;

  if (loading) return <SkeletonList withActions={Boolean(renderActions)} />;

  if (!machines || machines.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyTitle}>{emptyTitle}</div>
        <div style={styles.emptySub}>{emptySubtitle}</div>
      </div>
    );
  }

  const hasActions = Boolean(renderActions);

  return (
    <div style={styles.tableWrap}>
      <div
        style={{
          ...styles.tableHead,
          gridTemplateColumns: hasActions
            ? "120px 1fr 1fr 140px 180px"
            : "120px 1fr 1fr 140px",
        }}
      >
        <div style={styles.th}>ID</div>
        <div style={styles.th}>Memory</div>
        <div style={styles.th}>Disk</div>
        <div style={styles.th}>Status</div>
        {hasActions ? <div style={styles.th}>Actions</div> : null}
      </div>

      <div style={styles.rows}>
        {machines.map((m) => (
          <div
            key={m.id}
            style={{
              ...styles.row,
              gridTemplateColumns: hasActions
                ? "120px 1fr 1fr 140px 180px"
                : "120px 1fr 1fr 140px",
            }}
          >
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

            {hasActions ? <div style={styles.actionsCell}>{renderActions(m)}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const isReady = s === "ready";
  const label = isReady ? "Ready" : s === "pending" ? "Pending" : status;

  return (
    <span
      style={{
        ...styles.pill,
        background: isReady ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
        color: isReady ? "#15803d" : "#92400e",
        border: isReady ? "1px solid rgba(34,197,94,0.22)" : "1px solid rgba(234,179,8,0.22)",
      }}
    >
      {label}
    </span>
  );
}

function SkeletonList({ withActions }) {
  const cols = withActions ? 5 : 4;
  const template = withActions ? "120px 1fr 1fr 140px 180px" : "120px 1fr 1fr 140px";

  return (
    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.skeletonRow,
            gridTemplateColumns: template,
          }}
        >
          {Array.from({ length: cols }).map((__, j) => (
            <div
              key={j}
              style={j === cols - 1 && withActions ? styles.skelBoxSmall : styles.skelBox}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const styles = {
  tableWrap: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,0.08)",
    overflow: "hidden",
    background: "rgba(255,255,255,0.85)",
  },
  tableHead: {
    display: "grid",
    gap: 10,
    padding: "12px 14px",
    borderBottom: "1px solid rgba(15,23,42,0.06)",
    background: "rgba(248,250,252,0.9)",
  },
  th: { fontSize: 12, fontWeight: 900, color: "#475569" },

  rows: { display: "grid" },
  row: {
    display: "grid",
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
  actionsCell: { display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" },

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

  empty: {
    marginTop: 14,
    padding: 18,
    borderRadius: 18,
    border: "1px dashed rgba(15,23,42,0.16)",
    background: "rgba(255,255,255,0.6)",
  },
  emptyTitle: { fontWeight: 900, fontSize: 14 },
  emptySub: { marginTop: 6, color: "#64748b", fontSize: 13, lineHeight: 1.5 },

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

  skeletonRow: {
    display: "grid",
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
    width: 90,
    borderRadius: 999,
    justifySelf: "end",
    background: "linear-gradient(90deg, rgba(226,232,240,0.6), rgba(226,232,240,0.9), rgba(226,232,240,0.6))",
  },
};
