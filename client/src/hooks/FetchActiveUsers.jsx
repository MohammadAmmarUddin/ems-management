import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchActiveUsers = async (baseUrl) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem('token');
    const res = await axios.get(`${baseUrl}/api/user/active`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.result;
};

const useActiveUsers = (baseUrl) => {
    return useQuery({
        queryKey: ["actives"],
        queryFn: () => fetchActiveUsers(baseUrl),
    });
};
export default useActiveUsers;
