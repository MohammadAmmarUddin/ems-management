import { useAuth } from "../context/AuthContext";


const EmployeeDashboard = () => {
    const {user}= useAuth()
    return (
        <div>
            <h2>Employee Dashboard {user && user.name}</h2>
            
        </div>
    );
};

export default EmployeeDashboard;