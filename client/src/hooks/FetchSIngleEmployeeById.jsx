import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSingleDep = async (id, baseUrl) => {
  const { data } = await axios.get(
    `${baseUrl}/api/department/getSingleDep/${id}`
  );
  return data.result;
};

const useSingleDepartment = (id, baseUrl) => {
  return useQuery({
    queryKey: ["single-department", id],
    queryFn: () => fetchSingleDep(id, baseUrl),
    enabled: !!id, // Only runs if id is truthy
  });
};

export default useSingleDepartment;
