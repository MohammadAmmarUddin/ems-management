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
    <div className="p-2 sm:p-3 md:p-5 bg-gray-50 shadow-md rounded-lg w-full mx-auto">
      <h1 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-gray-800 text-center">
        Attendance Report
      </h1>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <label htmlFor="dateFilter" className="text-sm sm:text-base text-gray-600">
            Filter by Date:
          </label>
          <input
            id="dateFilter"
            onChange={(e) => setDateFilter(e.target.value)}
            type="date"
            className="px-3 py-2 text-sm sm:text-base border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={handleDownload}
            className="px-4 sm:px-5 py-2 font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition text-sm sm:text-base"
          >
            Download CSV
          </button>
          {hasMore && !loading && (
            <button
              onClick={handleLoadMore}
              className="px-4 sm:px-5 py-2 font-semibold text-white bg-primary rounded-md hover:bg-secondary transition text-sm sm:text-base"
            >
              Load More
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 mb-6 text-sm sm:text-base">
          Error loading attendance
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {combinedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No attendance records found
          </div>
        ) : (
          combinedData.map((item, idx) => (
            <div
              key={`${item.employeeId}-${item.date}-${idx}`}
              className="bg-white rounded-lg shadow p-3 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-semibold">{item.name || "N/A"}</p>
                  <p className="text-xs text-gray-600">
                    ID: {item.employeeId || "N/A"}
                  </p>
                </div>
                <span className="text-xs text-gray-500 ml-2">{item.date}</span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Department:</span>{" "}
                {item.department || "N/A"}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Status:</span> {item.status || "N/A"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-md shadow">
        {combinedData.length > 0 ? (
          <table className="w-full border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-gray-700 font-semibold text-left">Date</th>
                <th className="p-3 text-gray-700 font-semibold text-left">
                  EmployeeId
                </th>
                <th className="p-3 text-gray-700 font-semibold text-left">Name</th>
                <th className="p-3 text-gray-700 font-semibold text-left">
                  Department
                </th>
                <th className="p-3 text-gray-700 font-semibold text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {combinedData.map((item, idx) => (
                <tr key={`${item.employeeId}-${item.date}-${idx}`} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 text-sm">{item.date}</td>
                  <td className="p-3 text-sm">{item.employeeId}</td>
                  <td className="p-3 text-sm">{item.name}</td>
                  <td className="p-3 text-sm">{item.department}</td>
                  <td className="p-3 text-sm">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">No attendance records found</div>
        )}
      </div>

      {loading && (
        <div className="animate-pulse mt-6 text-gray-500 text-sm">Fetching more...</div>
      )}
    </div>
  );
}

export default AttendanceReport;
