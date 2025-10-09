import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Helper to get token
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

// ===============================
// Department Count
const fetchDepartmentCount = async (baseUrl) => {
  const res = await fetch(`${baseUrl}/api/department/getCountDep`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
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

// ===============================
// Salary Aggregation
const fetchSalaryAggregation = async (baseUrl) => {
  const response = await fetch(`${baseUrl}/api/salary/getTotalSalary`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error("Failed to fetch salary aggregation");
  }

  return data.totalSalary;
};

export const useSalaryAggregation = (baseUrl) => {
  return useQuery({
    queryKey: ["salary", "aggregation"],
    queryFn: () => fetchSalaryAggregation(baseUrl),
  });
};

// ===============================
// Employee Count
const fetchUsersCount = async (baseUrl) => {
  const response = await fetch(`${baseUrl}/api/employee/getEmployeesCount`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

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

// ===============================
// Project Count
export const useProjectCount = (baseUrl) => {
  return useQuery({
    queryKey: ["runningProjectsFetchAll"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/projects/getInProgressProjects`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch project count");
      }
      return data;
    },
  });
};

// ===============================
// Department Distribution
const fetchDepartmentDistribution = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/department/distribution`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};

export const useDepartmentDistribution = (baseUrl) => {
  return useQuery({
    queryKey: ["department-distribution"],
    queryFn: () => fetchDepartmentDistribution(baseUrl),
  });
};

// ===============================
// Leave Stats
const fetchLeaveStats = async (baseUrl) => {
  const response = await axios.get(`${baseUrl}/api/leave/stats/summary`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};

export const useLeaveStats = (baseUrl) => {
  return useQuery({
    queryKey: ["leaveStats"],
    queryFn: () => fetchLeaveStats(baseUrl),
  });
};

// ===============================
// Monthly Salary Data
const fetchMonthlySalaryData = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/salary/monthly-summary`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.data;
};

export const useMonthlySalaryData = (baseUrl) => {
  return useQuery({
    queryKey: ["monthlySalaryData"],
    queryFn: () => fetchMonthlySalaryData(baseUrl),
  });
};

// ===============================
// Leave Separated Stats
const fetchLeaveCountSperate = async (baseUrl) => {
  const res = await axios.get(`${baseUrl}/api/leave/seperate-stats`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const useLeaveSeperateStats = (baseUrl) => {
  return useQuery({
    queryKey: ["leaveSeperateStats"],
    queryFn: () => fetchLeaveCountSperate(baseUrl),
  });
};
