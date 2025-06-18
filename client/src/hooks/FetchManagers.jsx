import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// Fetcher function
const fetchManagers = async (baseUrl) => {
  const token = await localStorage.getItem("token");
  console.log("token", token);
  const res = await axios.get(`${baseUrl}/api/manager/getManagers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
};

// Custom hook
const useManagers = ({ baseUrl }) => {
  return useQuery({
    queryKey: ["managers"],
    queryFn: () => fetchManagers(baseUrl),

  });
};

export default useManagers;
