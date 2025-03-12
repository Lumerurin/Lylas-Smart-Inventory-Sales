import React, { useEffect, useState } from "react";
import Layout from "../layout";
import SalesSummary from "./components/salesSummary";
import SalesOrder from "./components/salesOrder";
import MonthlySalesChart from "./components/lineChart";
import BestSellingProductsContainer from "./components/BestSellingProductsContainer";

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
            {/* Right Section */}
            <div className="p-6 md:p-10 bg-solidWhite rounded-lg shadow-lg w-full md:w-[60%] lg:w-[30%] h-auto md:h-full">
            <BestSellingProductsContainer />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
