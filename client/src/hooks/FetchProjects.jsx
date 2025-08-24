import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProjects = async (baseUrl, search, page = 1, limit = 5) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const endpoint = `${baseUrl}/api/projects/search?q=${encodeURIComponent(
    search
  )}&page=${page}&limit=${limit}`;

  const res = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; // contains { projects, total, page, limit }
};

const useProjects = (baseUrl, search = "", page = 1, limit = 5) => {
  return useQuery({
    queryKey: ["projects", search, page, limit],
    queryFn: () => fetchProjects(baseUrl, search, page, limit),
    keepPreviousData: true,
  });
};

export default useProjects;
