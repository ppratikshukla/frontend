import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { subjectAPI } from "../api/api";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDate = (d) => {
  const date = new Date(d);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const HistoryView = ({ subject, onBack }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    subjectAPI
      .getLogs(subject._id)
      .then((res) => setLogs(res.data.logs))
      .catch(() => toast.error("Failed to load logs"))
      .finally(() => setLoading(false));
  }, [subject._id]);

  const filtered =
    filter === "all" ? logs : logs.filter((l) => l.status === filter);

  const pct =
    subject.totalClasses > 0
      ? parseFloat(
          ((subject.presentCount / subject.totalClasses) * 100).toFixed(1),
        )
      : 0;

  const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        ← Back to History
      </button>

      {/* Subject summary */}
      <div
        className="stat-card"
        style={{ marginBottom: 20, "--card-color": subject.color }}
      >
        <div
          className="stat-icon"
          style={{
            background: subject.color + "22",
            color: subject.color,
            fontSize: "1.2rem",
            fontWeight: 800,
          }}
        >
          {pct}%
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 6,
            }}
          >
            {subject.name}
            {subject.code && (
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text3)",
                  marginLeft: 8,
                }}
              >
                {subject.code}
              </span>
            )}
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${pct}%`, background: color }}
            />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{ fontSize: "0.8rem", color: "#4ade80", fontWeight: 600 }}
          >
            {subject.presentCount} P
          </div>
          <div
            style={{ fontSize: "0.8rem", color: "#fc8181", fontWeight: 600 }}
          >
            {subject.totalClasses - subject.presentCount} A
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["all", "present", "absent"].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? "📋 All"
              : f === "present"
                ? "✅ Present"
                : "❌ Absent"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No records found</div>
          <div className="empty-desc">
            {filter !== "all"
              ? `No ${filter} records for this subject.`
              : "No attendance logged yet."}
          </div>
        </div>
      ) : (
        <div className="log-list">
          {filtered.map((log) => (
            <div className="log-item" key={log._id}>
              <div className={`log-dot ${log.status}`} />
              <div className="log-date">{formatDate(log.date)}</div>
              {log.note && <div className="log-note">{log.note}</div>}
              <span className={`log-status ${log.status}`}>{log.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HistoryPage = ({ initialSubject, onClearInitial }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(
    initialSubject || null,
  );

  useEffect(() => {
    subjectAPI
      .getAll()
      .then((res) => setSubjects(res.data.subjects))
      .catch(() => toast.error("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );

  if (selectedSubject) {
    return (
      <HistoryView
        subject={selectedSubject}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Attendance History</h1>
        <p className="page-subtitle">View detailed records per subject</p>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">No subjects yet</div>
          <div className="empty-desc">
            Add subjects and mark attendance to see your history here.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {subjects.map((s) => {
            const pct =
              s.totalClasses > 0
                ? parseFloat(
                    ((s.presentCount / s.totalClasses) * 100).toFixed(1),
                  )
                : 0;
            const color =
              pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

            return (
              <div
                key={s._id}
                className="stat-card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedSubject(s)}
              >
                <div
                  className="stat-icon"
                  style={{
                    background: s.color + "22",
                    color: s.color,
                    fontSize: "0.85rem",
                    fontWeight: 800,
                  }}
                >
                  {pct}%
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
                        fontWeight: 700,
                        color: "var(--text)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{ fontSize: "0.78rem", color: "var(--text3)" }}
                    >
                      {s.presentCount}/{s.totalClasses} classes
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
                <span style={{ color: "var(--text3)", fontSize: "1rem" }}>
                  ›
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
