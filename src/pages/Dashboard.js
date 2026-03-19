import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { subjectAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

/* Circular progress ring */
const AttentionRing = ({ pct }) => {
  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="attention-ring-container">
      <div className="attention-ring-wrap">
        <div className="attention-ring-label">Overall Attention</div>
        <div style={{ position: "relative", width: size, height: size }}>
          <svg className="ring-svg" width={size} height={size}>
            <circle
              className="ring-track"
              cx={size / 2}
              cy={size / 2}
              r={r}
              strokeWidth={stroke}
            />
            <circle
              className="ring-progress"
              cx={size / 2}
              cy={size / 2}
              r={r}
              strokeWidth={stroke}
              stroke={color}
              strokeDasharray={circ}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="ring-center">
            <div className="ring-pct" style={{ color }}>
              {pct}
              <span className="ring-pct-sign">%</span>
            </div>
            <div className="ring-label">Attendance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onPageChange }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await subjectAPI.getDashboard();
      setData(res.data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );

  const d = data || {};

  let overallStatus = "";
  if (d.totalClasses > 0) {
    const rOverall = 3 * d.totalClasses - 4 * d.totalPresent;
    if (rOverall > 0) {
      overallStatus = `Need ${rOverall} more lecture${rOverall > 1 ? 's' : ''} to reach 75%`;
    } else {
      const mOverall = Math.floor((4 * d.totalPresent - 3 * d.totalClasses) / 3);
      overallStatus = `On track! Can miss ${mOverall} class${mOverall !== 1 ? 'es' : ''}`;
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hey, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="page-subtitle">
          Here's your attendance overview for today
        </p>
        {overallStatus && (
          <p style={{ marginTop: "10px", fontSize: "0.95rem", fontWeight: "600", color: overallStatus.includes("Need") ? "#ef4444" : "#22c55e" }}>
            {overallStatus}
          </p>
        )}
      </div>

      {/* Alerts */}
      {d.hasAlerts && (
        <div className="alert-banner">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <h4>Low Attendance Warning</h4>
            <p>
              {d.alerts.map((a) => `${a.name} (${a.percentage}%)`).join(", ")} —
              below 75% threshold
            </p>
          </div>
        </div>
      )}

      {/* Big Ring */}
      <AttentionRing pct={d.overallPercentage || 0} />

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(99,102,241,0.15)" }}
          >
            📚
          </div>
          <div className="stat-content">
            <div className="stat-value">{d.totalSubjects || 0}</div>
            <div className="stat-label">Subjects</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(34,197,94,0.15)" }}
          >
            ✅
          </div>
          <div className="stat-content">
            <div className="stat-value">{d.totalPresent || 0}</div>
            <div className="stat-label">Classes Attended</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(239,68,68,0.15)" }}
          >
            ❌
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {(d.totalClasses || 0) - (d.totalPresent || 0)}
            </div>
            <div className="stat-label">Classes Missed</div>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(245,158,11,0.15)" }}
          >
            📅
          </div>
          <div className="stat-content">
            <div className="stat-value">{d.totalClasses || 0}</div>
            <div className="stat-label">Total Classes</div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      {(d.subjectStats || []).length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text2)",
              marginBottom: 14,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Subject Breakdown
          </h3>
          <p style={{fontSize: "0.85rem", color: "var(--text3)", marginBottom: "15px"}}>
            (Click on a subject to see more details)
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.subjectStats.map((s) => (
              <div
                key={s._id}
                className="stat-card"
                style={{ cursor: "pointer", gap: 14 }}
                onClick={() => onPageChange("subjects")}
              >
                <div
                  className="stat-icon"
                  style={{
                    background: s.color + "22",
                    color: s.color,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  }}
                >
                  {s.percentage}%
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{ fontSize: "0.78rem", color: "var(--text3)" }}
                    >
                      {s.presentCount}/{s.totalClasses}
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${s.percentage}%`,
                        background:
                          s.percentage >= 75
                            ? "#22c55e"
                            : s.percentage >= 50
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    />
                  </div>
                </div>
                {s.isLow && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#fc8181",
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ Low
                  </span>
                )}
                <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: "4px" }}>
                  {(() => {
                    const r = 3 * s.totalClasses - 4 * s.presentCount;
                    if (r > 0) return `Need ${r} more to reach 75%`;
                    const m = Math.floor((4 * s.presentCount - 3 * s.totalClasses) / 3);
                    return `Can miss ${m} class${m !== 1 ? 'es' : ''}`;
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(d.totalSubjects || 0) === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <div className="empty-title">No subjects yet</div>
          <div className="empty-desc">
            Go to My Subjects to add your first subject and start tracking
            attendance.
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => onPageChange("subjects")}
          >
            + Add Subject
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
