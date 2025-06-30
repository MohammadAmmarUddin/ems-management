import { useEffect, useState } from "react";

function AttendanceReport() {
  const [groupData, setGroupData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit] = useState(100);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const baseUrl = import.meta.env.VITE_EMS_Base_URL || "http://localhost:5001";
  const token = localStorage.getItem("token") || sessionStorage.getItem('token');

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
      console.log(groupData);
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

  if (loading || !groupData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 m-8 bg-gray-50 shadow-md rounded-lg w-full mx-auto">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 text-center">
        Attendance Report
      </h1>

      <div className="mb-6 flex items-center">
        <label htmlFor="dateFilter" className="mr-4 text-gray-600">
          Filter by Date:
        </label>
        <input
          id="dateFilter"
          onChange={(e) => setDateFilter(e.target.value)}
          type="date"
          className="p-2 mr-6 border rounded-md border-gray-300 "
        />
        <button
          onClick={handleDownload}
          className="px-4 py-2 mr-6 font-semibold text-gray-100 bg-blue-900 rounded-md hover:bg-blue-800 transition "
        >
          Download CSV
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-6">Error loading attendance</div>
      )}

      {combinedData.length > 0 && (
        <table className="w-full bg-gray-100 border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-gray-700 font-semibold">Date</th>
              <th className="p-3 text-gray-700 font-semibold">EmployeeId</th>
              <th className="p-3 text-gray-700 font-semibold">Name</th>
              <th className="p-3 text-gray-700 font-semibold">Department</th>
              <th className="p-3 text-gray-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((item, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{item.date}</td>
                <td className="p-3">{item.employeeId}</td>
                <td className="px-5">{item.name}</td>
                <td className="p-3">{item.department}</td>
                <td className="p-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {hasMore && !loading && (
        <button
          onClick={handleLoadMore}
          className="px-4 py-2 mt-6 font-semibold text-gray-100 bg-blue-900 rounded-md hover:bg-blue-800 transition"
        >
          Loading more...
        </button>
      )}

      {loading && (
        <div className="animate-pulse mt-6 text-gray-500">Fetching more...</div>
      )}
    </div>
  );
}

export default AttendanceReport;
