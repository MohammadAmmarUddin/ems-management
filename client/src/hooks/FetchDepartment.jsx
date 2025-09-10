import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const fetchDepartments = async ({ baseUrl, search, page, limit }) => {
  const endpoint = search
    ? `${baseUrl}/api/department/search?q=${encodeURIComponent(
        search
      )}&page=${page}&limit=${limit}`
    : `${baseUrl}/api/department/getAllDep?page=${page}&limit=${limit}`;

  const res = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return res.data; // ✅ full response { result, total, page, limit }
};

const useDepartments = (baseUrl, search, page, limit) => {
  return useQuery({
    queryKey: ["departments", search, page, limit],
    queryFn: () => fetchDepartments({ baseUrl, search, page, limit }),
    keepPreviousData: true,
  });
};

export default useDepartments;
