import { FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Summary= () => {

    const {user}= useAuth()
    return (
        <div  className="flex rounded bg-white">
        
            <div className={`flex items-center text-3xl bg-teal-600 text-white justify-center px-4`}><FaUser/></div>
            <div className="pl-4 py-1 font-bold ">
                <p className="font-bold text-xl">{`Welcome Back`}</p>
                <p>{user.name}</p>
             
            </div>
        </div>
    );
};

export default Summary;