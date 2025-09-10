import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Define the fetch function
const fetchDepartments = async (baseUrl, search) => {
  const endpoint = search
    ? `${baseUrl}/api/department/search?q=${encodeURIComponent(search)}`
    : `${baseUrl}/api/department/getAllDep`;

  const res = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.result;
};

// Custom hook
const useDepartments = (baseUrl, search = "") => {
  return useQuery({
    queryKey: ["departments", search], // ✅ include search in cache key
    queryFn: () => fetchDepartments(baseUrl, search),
    retry: 3,
    keepPreviousData: true, // ✅ keeps old list while fetching new
  });
};

export default useDepartments;
