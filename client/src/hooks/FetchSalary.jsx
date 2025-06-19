// hooks/useSalaries.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSalaries = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/salary/getAllSalaries`);
  return res.data.result;
};

const useSalaries = ({ baseUrl, user, loading }) => {
  return useQuery({
    queryKey: ["salaries"],
    queryFn: () => fetchSalaries(baseUrl),
    retry: 5,
    staleTime: 5 * 60 * 1000,
  });
};

export default useSalaries;
