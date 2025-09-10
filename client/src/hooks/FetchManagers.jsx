import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const fetchManagers = async ({ queryKey }) => {
  const [, { baseUrl, search = "", page = 1, limit = 5, showAll = false }] =
    queryKey;

  const params = {
    q: search,
    page,
    limit,
    all: showAll ? "true" : "false",
  };

  const res = await axios.get(`${baseUrl}/api/employee/searchEmployees`, {
    params,
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return {
    managers: res.data.employees || [],
    total: res.data.total || 0,
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
