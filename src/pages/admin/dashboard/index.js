import React, { useContext, useEffect, useState } from "react";
import Layout from "../layout";
import SalesSummary from "./components/salesSummary";
//import StockReport from "./components/stockReport";
import SalesOrder from "./components/salesOrder";
import MonthlySalesChart from "./components/lineChart";

const Dashboard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <Layout>
      <section className="h-full flex flex-col overflow-y-scroll">
        <h1 className="text-blueSerenity py-2 text-lg md:text-xl text-right md:text-left w-full">
          Hello, {username}
        </h1>
        <div className="flex flex-col flex-1 gap-8 overflow-hidden">
          <SalesSummary />
          <div className="flex w-full flex-col md:flex-row gap-4 md:gap-8 flex-1">
            {/* Left Section */}
            <div className="flex flex-col w-full gap-8 flex-1 h-full">
              <div className="bg-solidWhite flex-1 rounded-lg shadow-lg p-5 h-full">
                <h2>Sales Report</h2>
                <MonthlySalesChart />
              </div>
              <SalesOrder />
            </div>
            {/* Right Section - Empty Container */}
            <div className="p-6 md:p-10 bg-solidWhite rounded-lg shadow-lg w-full md:w-[60%] lg:w-[30%] h-auto md:h-full">
              <div className="flex items-center justify-between">
                <h2>Best Selling Products</h2>
                <select className="text-left pl-3 bg-white w-fit">
                  <option>Last 7 Days</option>
                  <option>1 Month</option>
                  <option>1 Year</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-2 my-5">
                  <span className="font-semibold text-darkerGray">
                    Product Name
                  </span>
                  <span className="font-semibold text-darkerGray">
                    Total Sales
                  </span>
                </div>

                <div className="grid grid-cols-2 bg-white shadow-lg p-2 items-center rounded-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-blueSerenity w-8 h-8 flex items-center justify-center rounded-full text-white">
                      1
                    </div>
                    <span>Name</span>
                  </div>
                  <span>P 0.00</span>
                </div>

                <div className="grid grid-cols-2 bg-white shadow-lg p-2 items-center rounded-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-blueSerenity w-8 h-8 flex items-center justify-center rounded-full text-white">
                      1
                    </div>
                    <span>Name</span>
                  </div>
                  <span>P 0.00</span>
                </div>

                <div className="grid grid-cols-2 bg-white shadow-lg p-2 items-center rounded-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-blueSerenity w-8 h-8 flex items-center justify-center rounded-full text-white">
                      1
                    </div>
                    <span>Name</span>
                  </div>
                  <span>P 0.00</span>
                </div>

                <div className="grid grid-cols-2 bg-white shadow-lg p-2 items-center rounded-full">
                  <div className="flex items-center gap-3">
                    <div className="bg-blueSerenity w-8 h-8 flex items-center justify-center rounded-full text-white">
                      1
                    </div>
                    <span>Name</span>
                  </div>
                  <span>P 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
