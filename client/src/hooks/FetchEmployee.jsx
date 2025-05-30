import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetcher function
const fetchEmployees = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/employee/getEmployees`);
  return res.data.emp;
};

// Custom hook
const useEmployees = ({ baseUrl, user, loading }) => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(baseUrl),
    enabled: !!user && !loading, // Only fetch when user is available
    staleTime: 1000 * 60 * 5, // Optional: cache for 5 minutes
  });
};

export default useEmployees;
