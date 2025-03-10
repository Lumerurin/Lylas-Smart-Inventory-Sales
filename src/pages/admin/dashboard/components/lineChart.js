import React from "react";
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

const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 18000 },
  { month: "Mar", sales: 16000 },
  { month: "Apr", sales: 22000 },
  { month: "May", sales: 25000 },
  { month: "Jun", sales: 21000 },
  { month: "Jul", sales: 23000 },
  { month: "Aug", sales: 28000 },
  { month: "Sep", sales: 26000 },
  { month: "Oct", sales: 30000 },
  { month: "Nov", sales: 32000 },
  { month: "Dec", sales: 34000 },
];

const MonthlySalesChart = () => {
  return (
    <div className="w-full h-[400px] bg-white p-3 shadow-md rounded-lg">
      <h2 className="text-center text-xl font-semibold mb-4 text-darkerGray">
        Year 2025
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `P ${value / 1000}k`} />
          <Tooltip formatter={(value) => `P ${value.toLocaleString()}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#4E76CD"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          {/* <Line
            type="monotone"
            dataKey="target"
            stroke="#FF9800"
            strokeWidth={2}
            dot={{ r: 4 }}
          /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
