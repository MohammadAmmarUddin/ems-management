import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProjectsByDepartment = async (baseUrl) => {
    const token = await localStorage.getItem("token") || await sessionStorage.getItem("token");

    const res = await axios.get(`${baseUrl}/api/projects/getBydepartment`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data.result;
};

const useProjectsByDepartment = (baseUrl) => {
    return useQuery({
        queryKey: ["department-projects"],
        queryFn: () => fetchProjectsByDepartment(baseUrl),
    });
};

export default useProjectsByDepartment;
