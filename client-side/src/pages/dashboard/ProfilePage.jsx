// src/pages/dashboard/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ProfilePage (MVP)
 * - Shows basic "session" info from localStorage (auth_mode + token)
 * - Provides logout
 * - Ready to be wired to backend (/auth/me) later
 */

export default function ProfilePage() {
  const navigate = useNavigate();

  const authMode = useMemo(() => localStorage.getItem("auth_mode") || "user", []);
  const token = useMemo(() => localStorage.getItem("token") || "", []);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        // TODO replace with real API call later:
        // const me = await authService.me()
        const me = await mockGetMe({ authMode, token });
        if (mounted) setProfile(me);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authMode, token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_mode");
    navigate("/login", { replace: true });
  };

  const roleLabel = authMode === "company" ? "Company" : "User";

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.h2}>Profile</h2>
          <div style={styles.sub}>Your account and session information.</div>
        </div>

        <button onClick={logout} style={styles.ghostBtn}>
          Logout
        </button>
      </div>

      {error ? <div style={styles.error}>{error}</div> : null}

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div style={styles.grid}>
          {/* Main profile card */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Account</div>

            <div style={styles.kvGrid}>
              <KV label="Type" value={roleLabel} />
              <KV label="Name" value={profile?.name || "-"} />
              <KV label="Email" value={profile?.email || "-"} />
              <KV label="User ID" value={profile?.id != null ? String(profile.id) : "-"} mono />
            </div>

            <div style={styles.divider} />

            <div style={styles.note}>
              Next step: wire this page to your backend endpoint like <code>GET /auth/me</code> to show real data.
            </div>
          </div>

          {/* Session card */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Session</div>

            <div style={styles.kvGrid}>
              <KV label="Authenticated" value={token ? "Yes" : "No"} />
              <KV label="Token preview" value={token ? `${token.slice(0, 18)}…` : "-"} mono />
              <KV label="Login mode" value={authMode} mono />
            </div>

            <div style={styles.divider} />

            <div style={styles.actionsRow}>
              <button
                type="button"
                style={styles.primaryBtn}
                onClick={() => navigator.clipboard?.writeText(token || "")}
                disabled={!token}
              >
                Copy token
              </button>

              <button
                type="button"
                style={styles.ghostBtn}
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login", { replace: true });
                }}
              >
                Re-login
              </button>
            </div>

            <div style={styles.smallNote}>
              Token storage is currently <b>localStorage</b>. Later you can move to httpOnly cookies for better security.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KV({ label, value, mono }) {
  return (
    <div style={styles.kv}>
      <div style={styles.k}>{label}</div>
      <div style={{ ...styles.v, ...(mono ? styles.vMono : null) }}>{value}</div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div style={styles.grid}>
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} style={styles.card}>
          <div style={styles.skelTitle} />
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {Array.from({ length: 5 }).map((__, i) => (
              <div key={i} style={styles.skelRow}>
                <div style={styles.skelKey} />
                <div style={styles.skelVal} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------- MOCK API (replace later) -------------------- */
async function mockGetMe({ authMode }) {
  await sleep(450);

  if (authMode === "company") {
    return { id: 9001, name: "ArminCloud LLC", email: "company@email.com" };
  }
  return { id: 1001, name: "Ashkan", email: "user@email.com" };
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
    marginBottom: 14,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  card: {
    padding: 16,
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 10px 30px rgba(2,6,23,0.05)",
  },

  cardTitle: { fontWeight: 900, fontSize: 14 },

  kvGrid: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  kv: {
    padding: 12,
    borderRadius: 14,
    background: "#f8fafc",
    border: "1px solid rgba(15,23,42,0.06)",
  },
  k: { color: "#64748b", fontSize: 12, fontWeight: 900 },
  v: { marginTop: 6, fontSize: 13, fontWeight: 900, color: "#0f172a" },
  vMono: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontWeight: 800,
  },

  divider: {
    marginTop: 12,
    height: 1,
    background: "rgba(15,23,42,0.08)",
  },

  note: { marginTop: 12, color: "#64748b", fontSize: 12, lineHeight: 1.5 },
  smallNote: { marginTop: 10, color: "#94a3b8", fontSize: 12, lineHeight: 1.5 },

  actionsRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },

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

  // Skeleton
  skelTitle: {
    height: 14,
    width: 140,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(226,232,240,0.6), rgba(226,232,240,0.9), rgba(226,232,240,0.6))",
  },
  skelRow: { display: "grid", gridTemplateColumns: "110px 1fr", gap: 10, alignItems: "center" },
  skelKey: {
    height: 12,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(226,232,240,0.6), rgba(226,232,240,0.9), rgba(226,232,240,0.6))",
  },
  skelVal: {
    height: 12,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(226,232,240,0.6), rgba(226,232,240,0.9), rgba(226,232,240,0.6))",
  },
};
