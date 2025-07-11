import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const fetchEmployeeById = async (baseUrl, id) => {
  const res = await axios.get(`${baseUrl}/api/employee/getEmployee/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data.employee;
};

const useEmployeeById = (baseUrl, id) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployeeById(baseUrl, id),
    enabled: !!id,
  });
};

export default useEmployeeById;
