// hooks/useSalaries.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSalaryById = async (baseUrl, id) => {
  const res = await axios.get(`${baseUrl}/api/salary/getSalary/${id}`);
  return res.data.result;
};

const useSalaryById = ({ baseUrl, id }) => {
  return useQuery({
    queryKey: ["salaryById"],
    queryFn: () => fetchSalaryById(baseUrl, id),
  });
};

export default useSalaryById;
