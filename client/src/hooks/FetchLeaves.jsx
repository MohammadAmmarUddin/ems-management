import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetch function for leaves
const fetchLeaves = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/leave/getAllleaves`);
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
