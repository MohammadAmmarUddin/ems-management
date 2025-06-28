import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetcher function
const fetchEmployees = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/employee/getEmployees`);
  return res.data.result;
};

// Custom hook
const useEmployees = ({ baseUrl }) => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(baseUrl),
    retry: 5,

  });
};

export default useEmployees;
