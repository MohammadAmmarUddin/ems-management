// hooks/useDepartmentCount.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const fetchDepartmentCount = async () => {
  const res = await fetch("http://localhost:5001/api/department/getCountDep");
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch department count");
  }
  return data.countDep;
};

export const useDepartmentCount = () => {
  return useQuery({
    queryKey: ["departmentCount"],
    queryFn: fetchDepartmentCount,
    staleTime: 5 * 60 * 1000, // optional: cache for 5 minutes
  });
};


const fetchSalaryAggregation = async () => {
  const { data } = await axios.get("http://localhost:5001/api/salary/getTotalSalary");

  if (!data.success) {
    throw new Error("Failed to fetch salary aggregation");
  }

  return data.totalSalary; // { totalAmount, totalCount }
};

export const useSalaryAggregation = () => {
  return useQuery({
    queryKey: ["salary", "aggregation"],
    queryFn: fetchSalaryAggregation,
    staleTime: 5 * 60 * 1000, // 5 mins cache
  });
};

const fetchUsersCount = async (baseUrl) => {
  const { data } = await axios.get(`${baseUrl}/api/employee/getEmployeesCount`);
  if (!data.success) {
    throw new Error("Failed to fetch salary aggregation");
  }
  return data.totalEmployees; 
};

export const useEmployeesCount = (baseUrl) => {
  return useQuery({
    queryKey: ["totalUsersCount"],
    queryFn:()=> fetchUsersCount(baseUrl),
    staleTime: 5 * 60 * 1000, // 5 mins cache
  });
};

