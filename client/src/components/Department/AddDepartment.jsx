import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
    import { useNavigate } from 'react-router-dom';
import useDepartments from "../../hooks/FetchDepartment";
const AddDepartment = () => {
  const [selectedDepName, setSelectedDepName] = useState("");
  const [inputValue, setInputValue] = useState(""); // For capturing user input
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Track if dropdown is visible
  const inputRef = useRef(null); // To keep track of input field
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;
  const navigate= useNavigate();
  

 const { data: departments,refetch, isLoading, isError, error } = useDepartments(baseUrl);



  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Show dropdown if input field is not empty
    setDropdownVisible(value.length > 0);

    // Filter departments as user types
    if (value) {
      const filtered = departments.filter((department) =>
        department.dep_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments);
    }
  };

  // Handle selection from dropdown
  const handleSelect = (dep_name) => {
    setInputValue(dep_name); // Set the input to the selected department name
    setSelectedDepName(dep_name); // Set the selected department
    setDropdownVisible(false); // Hide suggestions after selection
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const dep_name = selectedDepName || inputValue; // Use the selected or typed value
    const dep_desc = form.dep_desc.value;

    // POST to add department
    axios
      .post(`${baseUrl}/api/department/add`, { dep_name, dep_desc })
      .then((res) => {
        if (res.data.success === true) {
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "New Department Added Successfully",
            showConfirmButton: false,
            timer: 1500,
          });refetch(); 
             navigate("/admin-dashboard/departments"); 
               
        }
      })
      .catch((error) => {
        Swal.fire({
          position: "middle",
          icon: "error",
          title: "Error adding department",
          showConfirmButton: true,
        });
        console.error(error);
      });

    form.reset();
    setInputValue("");

   // Refetch departments to update the list
      // Redirect to departments page after submission

  };


  
 if( isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto max-w-md shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Add Department
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Department Name</span>
            </label>
            <div ref={inputRef} className="relative">
              <input
                type="text"
                name="dep_name"
                className="hover:border-green-600 border-2 pl-4 w-full"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Start typing or select a department"
                required
              />

              {/* Show dropdown with filtered department names only if conditions met */}
              {dropdownVisible && filteredDepartments.length > 0 && (
                <div className="absolute mt-2 border-2 rounded-md max-h-60 overflow-y-auto w-full bg-white shadow-lg">
                  {filteredDepartments.map((department) => (
                    <div
                      key={department._id}
                      className="cursor-pointer hover:bg-gray-200 p-2"
                      onClick={() => handleSelect(department.dep_name)}
                    >
                      {department.dep_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Department Description</span>
            </label>
            <textarea
              rows={5}
              name="dep_desc"
              placeholder="Enter Department Description"
              className="hover:border-green-600 border-2 pl-4"
            ></textarea>
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-primary hover:bg-secondary font-semibold text-white"
            >
              Add New Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
