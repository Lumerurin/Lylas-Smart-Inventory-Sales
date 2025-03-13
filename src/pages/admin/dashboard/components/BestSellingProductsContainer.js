import React, { useState, useEffect } from "react";
import BestSellingProducts from "./BestSellingProducts";

const BestSellingProductsContainer = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [selectedRange, setSelectedRange] = useState("7days");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/best-selling?range=${selectedRange}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setBestSellingProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching best-selling products:", err);
        setError(
          "Failed to load best-selling products. Please try again later."
        );
      }
    };

    fetchBestSellingProducts();
  }, [selectedRange]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2>Best Selling Products</h2>
        <select
          className="text-left pl-3 bg-white w-fit"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="7days">Last 7 Days</option>
          <option value="1month">1 Month</option>
          <option value="1year">1 Year</option>
        </select>
      </div>
      <BestSellingProducts products={bestSellingProducts} error={error} />
    </div>
  );
};

export default BestSellingProductsContainer;
