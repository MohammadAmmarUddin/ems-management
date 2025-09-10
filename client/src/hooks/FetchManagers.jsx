import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Fetch managers: if search exists, call search API; otherwise get all
const fetchManagers = async ({ queryKey }) => {
  const [, { baseUrl, search = "", page = 1, limit = 5, showAll = false }] =
    queryKey;

  let url = `${baseUrl}/api/employee/managers`; // default API

  const params = { q: search, page, limit };

  // If search exists, call searchEmployees endpoint
  if (search) {
    url = `${baseUrl}/api/employee/searchEmployees`;
    params.role = "manager"; // ensure only managers are returned
  }

  const res = await axios.get(url, {
    params,
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return {
    managers: res.data.managers || res.data.employees || [],
    total: res.data.total || res.data.managers?.length || 0,
  };
};

const useManagers = ({
  baseUrl,
  search = "",
  page = 1,
  limit = 5,
  showAll = false,
}) => {
  return useQuery({
    queryKey: ["managers", { baseUrl, search, page, limit, showAll }],
    queryFn: fetchManagers,
    keepPreviousData: true,
    retry: 3,
  });
};

export default useManagers;
