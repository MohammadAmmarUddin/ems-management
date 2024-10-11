import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
    const {user} = useAuth()
    return (
        <div>
            <h2>admin dashboard,{user.name}</h2>
            
        </div>
    );
};

export default AdminDashboard;