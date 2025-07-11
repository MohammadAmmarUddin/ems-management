import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// Define the fetch function
const fetchDepartments = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/department/getAllDep`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data.result;
};

// Custom hook
const useDepartments = (baseUrl) => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchDepartments(baseUrl),
    retry: 5,

  });
};

// Default base URL, can be overridden
export default useDepartments;
