import React from "react";

const BestSellingProducts = ({ products, error }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-2 my-5">
        <span className="font-semibold text-darkerGray">Product Name</span>
        <span className="font-semibold text-darkerGray">Total Sales</span>
      </div>

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : products.length > 0 ? (
        products.map((product, index) => (
          <div key={index} className="grid grid-cols-2 bg-white shadow-lg p-2 items-center rounded-full">
            <div className="flex items-center gap-3">
              <div className="bg-blueSerenity w-8 h-8 flex items-center justify-center rounded-full text-white">
                {index + 1}
              </div>
              <span>{product.ProductName}</span>
            </div>
            <span>{product.totalSales.toLocaleString()}</span>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default BestSellingProducts;