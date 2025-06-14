import React, { useEffect, useState } from "react";

function AttendanceReport() {
  const [groupData, setGroupData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit] = useState(100);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const baseUrl = import.meta.env.VITE_EMS_Base_URL || "http://localhost:5001";
  const token = localStorage.getItem("token");

  const fetchData = async (newSkip = 0) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (dateFilter) query.append("date", dateFilter);
      if (limit) query.append("limit", limit);
      if (newSkip) query.append("skip", newSkip);

      const res = await fetch(
        `${baseUrl}/api/attendance/report?${query.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (data.success) {
        if (newSkip === 0) {
          setGroupData(data.groupData);
        } else {
          setGroupData((prev) => ({
            ...prev,
            ...data.groupData,
          }));
        }
        setSkip(newSkip);

        if (
          Object.keys(data.groupData).flatMap((date) => data.groupData[date])
            .length < limit
        ) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    setGroupData({});
    fetchData(0);
  }, [dateFilter]);

  const handleLoadMore = () => {
    const newSkip = skip + limit;
    fetchData(newSkip);
  };

  // Combine all dates into a single array of attendance
  const combinedData = Object.keys(groupData).flatMap((date) =>
    groupData[date].map((item) => ({
      date,
      ...item,
    }))
  );

  // CSV Download
  const handleDownload = () => {
    const headers = ["date", "employeeId", "name", "department", "status"];

    const rows = combinedData
      .map((item) =>
        [
          item.date,
          item.employeeId,
          item.name,
          item.department,
          item.status,
        ].join(",")
      )
      .join("\n");

    const csv = [headers.join(","), rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "Attendance_report.csv";
    a.click();

    URL.revokeObjectURL(url);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div
      style={{ padding: "30px", maxWidth: "1000px", margin: "30px auto" }}
      className="bg-gray-50 shadow-md rounded-lg"
    >
      <h1 style={{ marginBottom: "20px", color: "#334155" }}>
        Attendance Report
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="dateFilter"
          style={{ marginRight: "10px", color: "#334155" }}
        >
          Filter by Date:
        </label>
        <input
          id="dateFilter"
          onChange={(e) => setDateFilter(e.target.value)}
          type="date"
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleDownload}
          style={{
            marginLeft: "20px",
            padding: "8px 12px",
            background: "#1A237E",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Download CSV
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error loading attendance</div>}

      {combinedData.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#ffffff",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#edf2f7" }}>
            <tr>
              <th style={{ padding: "12px", color: "#334155" }}>Date</th>
              <th style={{ padding: "12px", color: "#334155" }}>EmployeeId</th>
              <th style={{ padding: "12px", color: "#334155" }}>Name</th>
              <th style={{ padding: "12px", color: "#334155" }}>Department</th>
              <th style={{ padding: "12px", color: "#334155" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((item, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: "1px solid #edf2f7" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#f9fafb")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "white")}
              >
                <td style={{ padding: "12px" }}>{item.date}</td>
                <td style={{ padding: "12px" }}>{item.employeeId}</td>
                <td style={{ padding: "12px" }}>{item.name}</td>
                <td style={{ padding: "12px" }}>{item.department}</td>
                <td style={{ padding: "12px" }}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {hasMore && !loading && (
        <button
          onClick={handleLoadMore}
          style={{
            padding: "10px 20px",
            background: "#1A237E",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Loading more...
        </button>
      )}

      <p className="text-primary animate-ping">
        {loading && <div>Fetching more...</div>}{" "}
      </p>
    </div>
  );
}

export default AttendanceReport;
