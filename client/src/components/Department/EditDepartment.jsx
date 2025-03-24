import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditDepartment = () => { 
    const [data,setData]= useState([])
    const {id} = useParams()
     useEffect(()=>{
       const fetchSingleDep= async() =>{  
        axios.get(`http://localhost:5001/api/department/getSingleDep/${id}`)
        .then(res=>{
            setData(res.data.result)
            console.log("single dep result",res.data);
        })
       }
     fetchSingleDep()
     },[])


    const handleSubmit = (e) => {
        e.preventDefault();
       console.log("id",id);
        const form = e.target;
        const dep_name = form.dep_name.value;
        const dep_desc = form.dep_desc.value;
    
        axios
          .put(`http://localhost:5001/api/department/updateDep/${id}`, {
            dep_name,
            dep_desc,
          })
          .then((res) => {
            console.log(res);
            if(res.data.success )
            {
              Swal.fire({
                position: "middle",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
              });
            }
          });
    
        form.reset();
      };
    
    return (
        <div className="mt-10">
      <div className="card bg-base-100 w-full mx-auto max-w-md shrink-0 shadow-2xl">
        <h2 className="text-center mt-10 font-bold text-3xl lg:text-4xl">
          Edit Department
        </h2>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Department Name</span>
            </label>
            <input
              type="text"
              name="dep_name"
              placeholder="Department Name"
              defaultValue={data.dep_name}
              className="input input-bordered focus:outline-none hover:border-green-600"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Department Description</span>
            </label>
            <textarea
              rows={5}
              name="dep_desc"
              defaultValue={data.dep_desc}
              placeholder="Enter Department Description"
              className="hover:border-green-600 border-2 pl-4"
            ></textarea>
          </div>
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn bg-primary hover:bg-secondary font-semibold text-white"
            >
              Edit Department
            </button>
          </div>
        </form>
      </div>
    </div>
    );
};

export default EditDepartment;