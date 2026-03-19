import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { subjectAPI } from "../api/api";

const AddSubjectModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await subjectAPI.add(form);
      toast.success("Subject added! 🎉");
      onAdded(res.data.subject);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">📚 Add Subject</h3>
        <form onSubmit={submit}>
          <div className="auth-form">
            <div className="form-group">
              <label className="form-label">Subject Name *</label>
              <input
                className="form-input"
                placeholder="e.g. Mathematics"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Subject Code{" "}
                <span
                  style={{
                    color: "var(--text3)",
                    textTransform: "none",
                    fontWeight: 400,
                  }}
                >
                  (optional)
                </span>
              </label>
              <input
                className="form-input"
                placeholder="e.g. MATH101"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "⏳ Adding..." : "+ Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubjectCard = ({ subject, onMark, onDelete, onViewHistory }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());

  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const dayBefore = new Date(today); dayBefore.setDate(today.getDate() - 2);

  const dates = [
    { label: "Today", value: today.toISOString() },
    { label: "Yesterday", value: yesterday.toISOString() },
    { label: "2 Days Ago", value: dayBefore.toISOString() }
  ];
  const pct =
    subject.totalClasses > 0
      ? parseFloat(
          ((subject.presentCount / subject.totalClasses) * 100).toFixed(1),
        )
      : 0;

  const isLow = subject.totalClasses > 0 && pct < 75;

  const color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

  let statusText = "";
  if (subject.totalClasses > 0) {
    const r = 3 * subject.totalClasses - 4 * subject.presentCount;
    if (r > 0) {
      statusText = `Need ${r} more lecture${r > 1 ? 's' : ''} to reach 75%`;
    } else {
      const m = Math.floor((4 * subject.presentCount - 3 * subject.totalClasses) / 3);
      statusText = `On track! Can miss ${m} class${m !== 1 ? 'es' : ''}`;
    }
  }

  return (
    <div className="subject-card" style={{ "--card-color": subject.color }}>
      <div className="subject-card-header">
        <div>
          <div className="subject-name">{subject.name}</div>
          {subject.code && <div className="subject-code">{subject.code}</div>}
        </div>
        <div className="subject-actions">
          <button
            className="icon-btn"
            title="View History"
            onClick={() => onViewHistory(subject)}
          >
            📅
          </button>
          <button
            className="icon-btn danger"
            title="Delete"
            onClick={() => onDelete(subject._id)}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Bar */}
      <div className="subject-bar-wrap">
        <div className="bar-row">
          <span className="bar-label">Attendance</span>
          <span className="bar-pct" style={{ color }}>
            {pct}%
          </span>
        </div>
        <div className="bar-track">
          <div
            className="bar-fill"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="subject-stats">
        <div className="mini-stat">
          <div className="mini-stat-val" style={{ color: "#22c55e" }}>
            {subject.presentCount}
          </div>
          <div className="mini-stat-lbl">Present</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat-val" style={{ color: "#ef4444" }}>
            {subject.totalClasses - subject.presentCount}
          </div>
          <div className="mini-stat-lbl">Absent</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat-val">{subject.totalClasses}</div>
          <div className="mini-stat-lbl">Total</div>
        </div>
      </div>

      {isLow && <div className="badge-low" style={{marginBottom: "5px"}}>⚠️ Below 75%</div>}
      
      {subject.totalClasses > 0 && (
        <div style={{ fontSize: "0.8rem", color: "var(--text3)", marginBottom: "12px", textAlign: "center", fontWeight: "500" }}>
          {statusText}
        </div>
      )}

      {/* Mark buttons */}
      <div className="mark-controls" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <select 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: "6px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
        >
          {dates.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        <div className="mark-row">
          <button
            className="mark-btn present"
            onClick={() => onMark(subject._id, "present", selectedDate)}
          >
            ✅ Present
          </button>
          <button
            className="mark-btn absent"
            onClick={() => onMark(subject._id, "absent", selectedDate)}
          >
            ❌ Absent
          </button>
        </div>
      </div>
    </div>
  );
};

const SubjectsPage = ({ onViewHistory }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    subjectAPI
      .getAll()
      .then((res) => setSubjects(res.data.subjects))
      .catch(() => toast.error("Failed to load subjects"))
      .finally(() => setLoading(false));
  }, []);

  const handleMark = async (id, status, date) => {
    try {
      const res = await subjectAPI.markAttendance(id, { status, date });
      const updated = res.data.subject;
      setSubjects((prev) =>
        prev.map((s) => (s._id === id ? { ...s, ...updated } : s)),
      );
      toast.success(
        status === "present" ? "✅ Marked Present!" : "❌ Marked Absent",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject and all its attendance records?"))
      return;
    try {
      await subjectAPI.remove(id);
      setSubjects((prev) => prev.filter((s) => s._id !== id));
      toast.success("Subject deleted");
    } catch {
      toast.error("Failed to delete subject");
    }
  };

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );

  return (
    <div>
      <div
        className="page-header"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 className="page-title">My Subjects</h1>
          <p className="page-subtitle">
            {subjects.length} subject{subjects.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <div className="empty-title">No subjects added yet</div>
          <div className="empty-desc">
            Add your subjects to start tracking attendance for each one.
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => setShowModal(true)}
          >
            + Add First Subject
          </button>
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map((s) => (
            <SubjectCard
              key={s._id}
              subject={s}
              onMark={handleMark}
              onDelete={handleDelete}
              onViewHistory={onViewHistory}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddSubjectModal
          onClose={() => setShowModal(false)}
          onAdded={(subject) => setSubjects((prev) => [subject, ...prev])}
        />
      )}
    </div>
  );
};

export default SubjectsPage;
