import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const fetchLeaves = async (baseUrl, { search = "", status = "" }) => {
  let endpoint = `${baseUrl}/api/leave/all`;

  if (search)
    endpoint = `${baseUrl}/api/leave/search?q=${encodeURIComponent(search)}`;
  if (status) endpoint = `${baseUrl}/api/leave/status/${status}`;

  const res = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.result || [];
};

const useLeaves = (baseUrl, search = "", status = "") => {
  return useQuery({
    queryKey: ["leaves", search, status],
    queryFn: () => fetchLeaves(baseUrl, { search, status }),
    retry: 3,
    keepPreviousData: true,
  });
};

export default useLeaves;
