import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { CaretRight, MagnifyingGlass, CalendarDots, CashRegister, Coins } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Separator from "../../../components/ui/Separator";

const SalesTrackingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [totalMonthSales, setTotalMonthSales] = useState(0);
  const [totalYearSales, setTotalYearSales] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/transactions')
      .then(response => response.json())
      .then(data => {
        setTransactions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [totalSalesRes, totalMonthSalesRes, totalYearSalesRes] = await Promise.all([
          fetch('http://localhost:5000/api/sales/total').then(res => res.json()),
          fetch('http://localhost:5000/api/sales/month').then(res => res.json()),
          fetch('http://localhost:5000/api/sales/year').then(res => res.json())
        ]);

        setTotalSales(Number(totalSalesRes.totalSales));
        setTotalMonthSales(Number(totalMonthSalesRes.totalMonthSales));
        setTotalYearSales(Number(totalYearSalesRes.totalYearSales));
      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    };

    fetchSummaryData();
  }, []);

  const filteredTransactions = transactions
    .filter(
      (transaction) => {
        const matchesSearchQuery = transaction.TransactionID.toString().includes(searchQuery) ||
                                  transaction.EmployeeID.toString().includes(searchQuery);
        const matchesSelectedDate = selectedDate ? 
          new Date(transaction.TransactionDate).toLocaleDateString() === new Date(selectedDate).toLocaleDateString() : 
          true;
        return matchesSearchQuery && matchesSelectedDate;
      }
    )
    .sort((a, b) => new Date(b.TransactionDate) - new Date(a.TransactionDate));

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl">Loading transactions...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="h-full flex flex-col gap-5 overflow-y-hidden">
        <div className="w-full flex items-center gap-3 ">
          <h1 className="text-blueSerenity py-5 text-lg sm:text-xl text-right w-full">
            Sales Tracking
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-3 md:gap-5 w-full">
          {/* Sales Summary Items */}
          {[
            {
              icon: <Coins size={32} />,
              value: `P${totalSales.toFixed(2)}`,
              label: "Total Sales",
            },
            {
              icon: <CalendarDots size={32} />,
              value: `P${totalMonthSales.toFixed(2)}`,
              label: "Total Month Sales",
            },
            {
              icon: <CalendarDots size={32} />,
              value: `P${totalYearSales.toFixed(2)}`,
              label: "Total Year Sales",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex gap-3 bg-solidWhite w-full p-4 sm:p-5 rounded-lg shadow-lg text-base sm:text-lg flex-col"
            >
              <label className="text-lunarGray font-semibold">
                {item.label}
              </label>
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-3xl text-darkerGray ">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center w-full justify-between">
          <div className="flex items-center relative">
            <input
              className=" text-left pl-14"
              placeholder="Search by Transaction ID or Employee ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlass size={32} className="absolute ml-3" />
          </div>

          <div className="flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex items-center gap-2 bg-blueSerenity text-white px-4 rounded-lg shadow-md hover:scale-110 transition-all duration-300 w-fit uppercase"
              onFocus={(e) => e.target.showPicker()}
            />
          </div>
        </div>
        
        <div className="w-full h-full overflow-y-scroll flex flex-col gap-3">
          <div className="w-full rounded-lg p-5 grid grid-cols-5 md:grid-cols-6 items-center">
            <span className="font-semibold text-darkGray text-xs sm:text-sm md:text-base md:text-left text-center">
              Transaction ID
            </span>
            <span className="font-semibold text-darkGray text-xs sm:text-sm md:text-base md:text-left text-center">
              Employee ID
            </span>
            <span className="font-semibold text-darkGray text-xs sm:text-sm md:text-base text-left">
              Schedule ID
            </span>
            <span className="font-semibold text-darkGray text-xs sm:text-sm md:text-base text-left">
              Transaction Date
            </span>
            <span className="font-semibold text-darkGray text-xs sm:text-sm md:text-base text-left">
              Total Cost
            </span>
          </div>

          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.TransactionID}
                className="bg-solidWhite w-full rounded-lg p-5 grid grid-cols-5 md:grid-cols-6 items-center"
              >
                <span className="text-darkGray">#{transaction.TransactionID}</span>
                <span>{transaction.EmployeeID}</span>
                <span>{transaction.ScheduleID}</span>
                <span>{new Date(transaction.TransactionDate).toLocaleDateString()}</span>
                <span>P {parseFloat(transaction.TotalCost).toFixed(2)}</span>
                <CaretRight
                  size={28}
                  color="#4E76CD"
                  className="hover:scale-110 transition-all duration-200 hover:cursor-pointer"
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-5">
              No matching results found.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SalesTrackingPage;
