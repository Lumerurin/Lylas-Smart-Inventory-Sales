import React, { useState, useEffect } from "react";

const TrackingModal = ({ product, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(product.ProductName);
  const [price, setPrice] = useState(product.Price);

  useEffect(() => {
    setName(product.ProductName);
    setPrice(product.Price);
  }, [product]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...product, ProductName: name, Price: price });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 p-2 bg-gray-300 rounded text-darkerGray"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackingModal;
