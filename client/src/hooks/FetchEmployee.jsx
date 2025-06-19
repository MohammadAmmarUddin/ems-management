import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetcher function
const fetchEmployees = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/employee/getEmployees`);
  return res.data.result;
};

// Custom hook
const useEmployees = ({ baseUrl, user }) => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(baseUrl),
    retry: 5,
    staleTime: 5 * 60 * 1000,
  });
};

export default useEmployees;
