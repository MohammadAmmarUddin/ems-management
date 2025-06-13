import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the fetch function
const fetchAttendance = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/attendance/getAttendances`);
  return res.data.attendance;
};

// Custom hook
const useAttendance = (baseUrl) => {
  return useQuery({
    queryKey: ["attendances"],
    queryFn: () => fetchAttendance(baseUrl),
  });
};

// Default base URL, can be overridden
export default useAttendance;
