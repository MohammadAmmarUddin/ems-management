import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");
// Fetcher function
const fetchEmployees = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/employee/getEmployees`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  console.log("Fetching employees from:", res.data.result);
  return res.data.result;
};

// Custom hook
const useEmployees = (baseUrl) => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees(baseUrl),
    retry: 5,

  });
};

export default useEmployees;
