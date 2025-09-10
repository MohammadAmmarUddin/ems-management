import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const fetchLeaves = async (baseUrl, search) => {
  const endpoint = search
    ? `${baseUrl}/api/leave/search?q=${encodeURIComponent(search)}`
    : `${baseUrl}/api/leave/all`;

  const res = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.result || [];
};

const useLeaves = (baseUrl, search = "") => {
  return useQuery({
    queryKey: ["leaves", search],
    queryFn: () => fetchLeaves(baseUrl, search),
    retry: 3,
    keepPreviousData: true,
  });
};

export default useLeaves;
