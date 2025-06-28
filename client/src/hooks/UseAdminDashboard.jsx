// hooks/useDepartmentCount.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const fetchDepartmentCount = async (baseUrl) => {
  const res = await fetch(`${baseUrl}/api/department/getCountDep`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch department count");
  }
  return data.countDep;
};

export const useDepartmentCount = (baseUrl) => {
  return useQuery({
    queryKey: ["departmentCount"],
    queryFn: () => fetchDepartmentCount(baseUrl),
  });
};

const fetchSalaryAggregation = async (baseUrl) => {
  const response = await fetch(`${baseUrl}/api/salary/getTotalSalary`);
  const data = await response.json();
  if (!data.success) {
    throw new Error("Failed to fetch salary aggregation");
  }

  return data.totalSalary; // { totalAmount, totalCount }
};

export const useSalaryAggregation = (baseUrl) => {
  return useQuery({
    queryKey: ["salary", "aggregation"],
    queryFn: () => fetchSalaryAggregation(baseUrl),
  });
};

const fetchUsersCount = async (baseUrl) => {
  const response = await fetch(`${baseUrl}/api/employee/getEmployeesCount`);

  const data = await response.json();
  if (!data.success) {
    throw new Error("Failed to fetch Users Count");
  }
  return data;
};

export const useEmployeesCount = (baseUrl) => {
  return useQuery({
    queryKey: ["totalUsersCount"],
    queryFn: () => fetchUsersCount(baseUrl),
  });
};

export const useProjectCount = (baseUrl) => {
  return useQuery({
    queryKey: ["projectsFetchAll"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/projects/getInProgressProjects`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch project count");
      }
      return data;
    },
  });
};


const fetchDepartmentDistribution = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/department/distribution`);
  return res.data;
};

export const useDepartmentDistribution = (baseUrl) => {
  return useQuery({
    queryKey: ["department-distribution"],
    queryFn: () => fetchDepartmentDistribution(baseUrl),
  });
};

const fetchLeaveStats = async (baseUrl) => {
  const response = await axios.get(`${baseUrl}/api/leave/stats`);
  return response.data;
};

export const useLeaveStats = (baseUrl) => {
  return useQuery({
    queryKey: ["leaveStats"],
    queryFn: () => fetchLeaveStats(baseUrl),
  });
};

const fetchMonthlySalaryData = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/salary/monthly-summary`);
  return res.data;
};

export const useMonthlySalaryData = (baseUrl) => {
  return useQuery({
    queryKey: ["monthlySalaryData"],
    queryFn: () => fetchMonthlySalaryData(baseUrl),
  });
};

const fetchLeaveCountSperate = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/leave/seperate-stats`);

  return res.data;
};

export const useLeaveSeperateStats = (baseUrl) => {
  return useQuery({
    queryKey: ["leaveSeperateStats"],
    queryFn: () => fetchLeaveCountSperate(baseUrl),
  });
};
