import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");
// Fetch function for leaves
const fetchLeaves = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/leave/getAllleaves`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data.result;
};

// Hook to fetch leaves only
const useLeaves = ({ baseUrl }) => {
  return useQuery({
    queryKey: ["leaves"],
    queryFn: () => fetchLeaves(baseUrl),
  });
};

export default useLeaves;
