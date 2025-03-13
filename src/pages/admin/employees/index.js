import React, { useEffect, useState } from "react";
import Layout from "../layout";
import { CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeePage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/all-employees")
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.EmployeeUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.EmployeeID.toString().includes(searchQuery)
  );

  return (
    <Layout>
      <section className="h-full flex flex-col justify-between">
        <div className="w-full flex items-center gap-3">
          <div
            className="bg-lightGray p-1 rounded-full hover:scale-110 transition-all duration-150 hover:cursor-pointer"
            onClick={() => navigate("/admin/inventory")}
          >
            <CaretLeft size={25} />
          </div>
          <h1 className="text-blueSerenity py-5">Employees</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-3">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center relative">
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                id="search"
                className="text-left pl-14"
                placeholder="Search by name or product number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlass size={32} className="absolute ml-3" />
            </div>
          </div>
        </div>

        <div className="w-full h-full overflow-y-scroll flex flex-col gap-3">
          <div className="w-full rounded-lg p-5 grid grid-cols-4 md:grid-cols-4 items-center">
            <span className="font-semibold text-darkGray text-lg sm:text-sm md:text-base md:text-left text-center">
              Employee ID
            </span>
            <span className="font-semibold text-darkGray text-lg sm:text-sm md:text-base md:text-left text-center">
              UserName
            </span>
            <span className="font-semibold text-darkGray text-lg sm:text-sm md:text-base text-left">
              Contact Number
            </span>
            <span className="font-semibold text-darkGray text-lg sm:text-sm md:text-base text-left">
              Email
            </span>
          </div>

          {filteredEmployees.map(employee => (
            <div key={employee.EmployeeID} className="w-full rounded-lg p-5 grid grid-cols-4 md:grid-cols-4 items-center bg-solidWhite">
              <span className="text-darkGray text-lg sm:text-sm md:text-base md:text-left text-center">
                {employee.EmployeeID}
              </span>
              <span className="text-darkGray text-lg sm:text-sm md:text-base md:text-left text-center">
                {employee.EmployeeUsername}
              </span>
              <span className="text-darkGray text-lg sm:text-sm md:text-base text-left">
                {employee.EmployeePhoneNumber}
              </span>
              <span className="text-darkGray text-lg sm:text-sm md:text-base text-left">
                {employee.EmployeeEmail}
              </span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default EmployeePage;