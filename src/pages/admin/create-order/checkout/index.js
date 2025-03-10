import React, { useState, useEffect } from "react";
import Layout from "../../layout";
import { CaretLeft, CheckCircle } from "@phosphor-icons/react";
import Separator from "../../../../components/ui/Separator";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CheckoutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [transaction, setTransaction] = useState({
    transactionID: 0,
    employeeID: 1, // Default employee ID, should be from auth context
    items: [],
    totalAmount: 0,
    cashReceived: 0,
    change: 0,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract cart items from location state
  useEffect(() => {
    const fetchNextTransactionID = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/transactions/next`);
        setTransaction(prev => ({
          ...prev,
          transactionID: response.data.transactionID
        }));
      } catch (err) {
        console.error("Error fetching next transaction ID:", err);
        setError("Failed to get transaction ID");
      }
    };
  
    fetchNextTransactionID();
  
    // If we have cart data from previous page
    if (location.state && location.state.cartItems) {
      const { cartItems, totalAmount, cashReceived } = location.state;
  
      setTransaction(prev => ({
        ...prev,
        items: cartItems,
        totalAmount,
        cashReceived,
        change: cashReceived - totalAmount
      }));
    }
  
    setLoading(false);
  }, [location.state]);

  
  const handleConfirm = async () => {
    try {
      setLoading(true);
      
      // Format the data for the API
      const checkoutData = {
        employeeID: transaction.employeeID,
        items: transaction.items.map(item => ({
          stockID: item.stockID,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        totalAmount: transaction.totalAmount,
        cashReceived: transaction.cashReceived
      };
      
      // Send checkout data to API
      const response = await axios.post(`${API_BASE_URL}/api/checkout`, checkoutData);
      
      if (response.data.success) {
        setTransaction(prev => ({
          ...prev,
          transactionID: response.data.transactionID,
          change: response.data.change
        }));
        
        setIsModalOpen(true);
      } else {
        setError("Checkout failed: " + response.data.error);
      }
    } catch (err) {
      console.error("Error processing checkout:", err);
      setError(`Checkout failed: ${err.response?.data?.details || err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = async () => {
    // If we have a valid transaction ID that has been created, cancel it
    if (transaction.transactionID && transaction.items.length > 0) {
      try {
        setLoading(true);
        const response = await axios.delete(`${API_BASE_URL}/api/transactions/${transaction.transactionID}`);
        
        if (response.data.success) {
          setIsCloseModal(false);
          navigate("/admin/create-order/");
        } else {
          setError("Failed to cancel transaction");
        }
      } catch (err) {
        console.error("Error cancelling transaction:", err);
        setError(`Failed to cancel: ${err.response?.data?.details || err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      // If no transaction created yet, just navigate back
      navigate("/admin/create-order/");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl">Loading transaction data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-full gap-4">
          <p className="text-xl text-red-500">{error}</p>
          <button 
            onClick={() => navigate("/admin/create-order/")}
            className="bg-blueSerenity text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200"
          >
            Back to Order Page
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isModalOpen && (
        <div className="w-full h-full inset-0 fixed bg-black/25 z-50 flex justify-center items-center">
          <div className="bg-solidWhite w-2/6 h-2/4 absolute rounded-lg flex flex-col justify-between items-center p-6">
            <div className="flex items-center justify-center flex-col">
              <CheckCircle size={350} color="#4E76CD" />
              <h2 className="text-darkerGray">Transaction Complete!</h2>
              <p className="text-darkGray mt-2">Transaction ID: {transaction.transactionID}</p>
              <p className="text-darkGray">Change: ₱ {transaction.change.toFixed(2)}</p>
            </div>
            <button
              onClick={() => navigate("/admin/create-order/")}
              className="bg-blueSerenity text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isCloseModal && (
        <div className="w-full h-full inset-0 fixed bg-black/25 z-50 flex justify-center items-center">
          <div className="bg-solidWhite w-2/6 h-[20%] absolute rounded-lg flex flex-col justify-between items-center p-6">
            <div className="flex items-center justify-center flex-col text-center">
              <h2 className="text-darkerGray font-semibold">
                Are you sure you want to cancel this transaction?
              </h2>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleCancel}
                className="bg-blueSerenity font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 w-36 border-2 border-blueSerenity text-blueSerenity bg-transparent"
              >
                Yes
              </button>
              <button
                onClick={() => setIsCloseModal(false)}
                className="bg-blueSerenity text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 w-36"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      
      <section className="h-full flex flex-col">
        <div className="w-full flex items-center gap-3">
          <div
            className="bg-lightGray p-1 rounded-full hover:scale-110 transition-all duration-150 hover:cursor-pointer"
            onClick={() => navigate("/admin/create-order")}
          >
            <CaretLeft size={25} />
          </div>
          <h1 className="text-blueSerenity py-5">Checkout</h1>
        </div>

        <div className="bg-solidWhite flex rounded-lg shadow-lg md:p-10 max-h-full h-full flex-col overflow-y-scroll w-full">
          <div className="flex flex-col md:grid md:grid-cols-2 w-full mb-5">
            <div className="w-full grid gap-3">
              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Transaction ID
                </span>
                <span className="text-darkGray">#{transaction.transactionID.toString().padStart(5, '0')}</span>
              </div>

              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Employee ID
                </span>
                <span className="text-darkGray">#{transaction.employeeID.toString().padStart(5, '0')}</span>
              </div>
            </div>

            <div className="w-full grid gap-3">
              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Time
                </span>
                <span className="text-darkGray">{transaction.time}</span>
              </div>

              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Date
                </span>
                <span className="text-darkGray">{transaction.date}</span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col flex-1 justify-between mt-20">
            <div className="w-full grid grid-cols-4">
              <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                Product
              </span>
              <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                Price
              </span>
              <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                Quantity
              </span>
              <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                Subtotal
              </span>
            </div>
            <Separator />

            {/* Content Section */}
            <div className="w-full h-full flex flex-col flex-1">
              {transaction.items.length > 0 ? (
                transaction.items.map((item, index) => (
                  <div key={index} className="w-full grid grid-cols-4">
                    <span className="py-3">{item.productName}</span>
                    <span className="py-3">₱ {item.price.toFixed(2)}</span>
                    <span className="py-3">{item.quantity} pcs</span>
                    <span className="py-3">₱ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500">
                  No items in cart
                </div>
              )}
              <Separator />

              {/* Payment Details */}
              <div className="flex flex-col w-full flex-1">
                <div className="w-full flex justify-between p-5">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Mode of Payment
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Cash
                  </span>
                </div>

                <div className="w-full flex justify-between px-5">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Discount
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    ₱ 0.00
                  </span>
                </div>

                <div className="w-full flex justify-between px-5 mt-2">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Total Amount
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    ₱ {transaction.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="w-full flex justify-between px-5 mt-2">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Cash Received
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    ₱ {transaction.cashReceived.toFixed(2)}
                  </span>
                </div>

                <div className="w-full flex justify-between px-5 mt-2">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Change
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    ₱ {transaction.change.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons Aligned at Bottom */}
            <div className="w-full flex justify-end gap-3 mt-auto sticky bottom-0 p-5">
              <button
                className="px-6 py-3 bg-gray-300 text-darkerGray rounded-lg hover:scale-105 transition-all duration-200"
                onClick={() => setIsCloseModal(true)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-blueSerenity text-white rounded-lg hover:scale-105 transition-all duration-200 disabled:bg-gray-400"
                onClick={handleConfirm}
                disabled={loading || transaction.items.length === 0}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;