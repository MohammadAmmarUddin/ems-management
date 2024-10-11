import { useAuth } from "../context/authContext";

const AdminDashboard = () => {
  const { user ,loading} = useAuth();

   if(loading)
   {
    return <div>loading...</div>
   }

  return (
    <div>
      <h2>admin dashboard,{user && user.name}</h2>
    </div>
  );
};

export default AdminDashboard;
