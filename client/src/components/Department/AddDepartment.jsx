import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

const AddDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepName, setSelectedDepName] = useState("");
  const [inputValue, setInputValue] = useState(""); // For capturing user input
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Track if dropdown is visible

  const inputRef = useRef(null); // To keep track of input field

  // Fetch department data
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/department/getAllDep");
      if (res.data.result && res.data.success === true) {
        setDepartments(res.data.result); // Store department objects
        setFilteredDepartments(res.data.result); // Filter suggestions
      }
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  // Handle input change
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
      .post("http://localhost:5001/api/department/add", { dep_name, dep_desc })
      .then((res) => {
        if (res.data.success === true) {
          Swal.fire({
            position: "middle",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });
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
    setInputValue(""); // Reset the input field after form submission
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    fetchDepartments();

    // Add event listener to detect clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
