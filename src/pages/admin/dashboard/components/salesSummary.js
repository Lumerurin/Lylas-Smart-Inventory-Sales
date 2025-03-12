import React, { useState, useEffect } from "react";
import {
  ChartLine,
  CalendarDots,
  CurrencyCircleDollar,
  ChefHat,
} from "@phosphor-icons/react";

const SalesSummary = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchSalesSummary = async () => {
    try {
      // Fetch all sales data in parallel
      const [todayRes, yearlyRes, incomeRes, productsRes] = await Promise.all([
        fetch('http://localhost:5000/api/sales/today'),
        fetch('http://localhost:5000/api/sales/yearly'),
        fetch('http://localhost:5000/api/income/net'),
        fetch('http://localhost:5000/api/products/count')
      ]);

      // Convert responses to JSON
      const todayData = await todayRes.json();
      const yearlyData = await yearlyRes.json();
      const incomeData = await incomeRes.json();
      const productsData = await productsRes.json();

      // Set state with fetched data
      setTodaySales(todayData.totalSales);
      setYearlySales(yearlyData.totalSales);
      setNetIncome(incomeData.netIncome);
      setProductCount(productsData.productCount);

      setError(null);
    } catch (err) {
      console.error("Error fetching sales summary data:", err);
      setError("Failed to load sales summary data. Please try again later.");
    }
  };

  // Call fetchSalesSummary inside useEffect
  useEffect(() => {
    fetchSalesSummary();
  }, []);

  return (
    <section className="p-4 sm:p-6 md:p-8 bg-solidWhite rounded-lg shadow-lg">
      <h2 className=" ">Sales Summary</h2>

      <div className="py-4 sm:py-5">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sales Summary Items */}
            {[
              {
                icon: <ChartLine size={40} weight="light" />,
                value: `₱ ${todaySales.toLocaleString()}`,
                label: "Today's Sale",
              },
              {
                icon: <CalendarDots size={40} weight="light" />,
                value: `₱ ${yearlySales.toLocaleString()}`,
                label: "Yearly Total Sales",
              },
              {
                icon: <CurrencyCircleDollar size={40} weight="light" />,
                value: `₱ ${netIncome.toLocaleString()}`,
                label: "Net Income",
              },
              {
                icon: <ChefHat size={40} weight="light" />,
                value: productCount,
                label: "Products",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-center bg-white p-4 sm:p-5 rounded-lg shadow-lg text-base sm:text-lg w-full hover:scale-105 transition-all duration-200"
              >
                {item.icon}
                <div className="flex flex-col">
                  <span className="font-semibold text-darkerGray">
                    {item.value}
                  </span>
                  <label className="text-lunarGray font-semibold">
                    {item.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SalesSummary;
