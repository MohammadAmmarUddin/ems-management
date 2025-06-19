import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// Fetcher function
const fetchManagers = async (baseUrl) => {
  const token = await localStorage.getItem("token") || await sessionStorage.getItem('token');
  const res = await axios.get(`${baseUrl}/api/employee/managers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.managers;
};

// Custom hook
const useManagers = ({ baseUrl }) => {
  return useQuery({
    queryKey: ["managers"],
    queryFn: () => fetchManagers(baseUrl),

    retry: 5,
    staleTime: 5 * 60 * 1000,
  });
};

export default useManagers;
