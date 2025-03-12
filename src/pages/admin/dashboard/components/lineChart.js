import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlySalesChart = () => {
  const [monthlySales, setMonthlySales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching data for year: ${selectedYear}`);
  
        // ✅ Use the full backend URL with port 5000
        const response = await fetch(`http://localhost:5000/api/monthly-sales?year=${selectedYear}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Received sales data:', data);
        setMonthlySales(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching monthly sales data:", err);
        setError("Failed to load sales data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMonthlySales();
  }, [selectedYear]);
  

  // Calculate available years for selection
  // Modify to include 2025 since that's when your transaction data is from
  const yearOptions = [2025, 2024, 2023, 2022, 2021];

  // Format the currency value for the tooltip
  const formatCurrency = (value) => {
    return `₱ ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Monthly Sales Performance</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-white border rounded p-1 text-sm"
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading sales data...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlySales}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={value => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalSales"
              name="Sales"
              stroke="#4F9DEE"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      
      {!isLoading && !error && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Sales ({selectedYear})</p>
            <p className="text-xl font-semibold">
              {formatCurrency(monthlySales.reduce((sum, item) => sum + item.totalSales, 0))}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Highest Month</p>
            {monthlySales.length > 0 && monthlySales.some(item => item.totalSales > 0) ? (
              <>
                <p className="text-xl font-semibold">
                  {(() => {
                    const highest = monthlySales.reduce((max, item) => 
                      item.totalSales > max.totalSales ? item : max, monthlySales[0]);
                    return `${highest.monthName} (${formatCurrency(highest.totalSales)})`;
                  })()}
                </p>
              </>
            ) : (
              <p className="text-xl font-semibold">No data</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlySalesChart;