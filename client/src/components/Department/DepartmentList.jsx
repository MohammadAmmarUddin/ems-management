import { Link } from "react-router-dom";

const DepartmentList = () => {
  return (
    <div>
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>
      <div className="flex justify-between">
        <input type="text" className="px-4  ml-5 py-0.5" placeholder="Search By Name" name="" id="" />
        <Link to="/admin-dashboard/add-department" className="px-6 py-1 mr-5 text-white rounded bg-green-600 hover:bg-green-800 font-semibold">Add New Department</Link>
      </div>



      
    </div>
  );
};

export default DepartmentList;
