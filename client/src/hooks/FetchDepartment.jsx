import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the fetch function
const fetchDepartments = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/department/getAllDep`);
  return res.data.result;
};

// Custom hook
const useDepartments = (baseUrl) => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchDepartments(baseUrl),
  });
};

// Default base URL, can be overridden
export default useDepartments;
