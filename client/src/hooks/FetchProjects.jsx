import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchManagers = async (baseUrl) => {
    const token = await localStorage.getItem("token") || await sessionStorage.getItem('token');
    console.log(token);
    const res = await axios.get(`${baseUrl}/api/projects/getAllProjects`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.result;
};


const useManagers = (baseUrl) => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: () => fetchManagers(baseUrl),

    });
};

export default useManagers;
