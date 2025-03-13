import React, { useState, useEffect } from "react";
import Layout from "../../layout";
import { CaretLeft, CheckCircle } from "@phosphor-icons/react";
import Separator from "../../../../components/ui/Separator";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const [transaction, setTransaction] = useState({
    transactionID: null,
    employeeID: null,
    items: [],
    totalAmount: 0,
    cashReceived: 0,
    change: 0,
    discountAmount: 0,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    paymentMethod: 'Cash'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const navigate = useNavigate();
  const location = useLocation();

  // Extract cart items from location state
  useEffect(() => {
    if (location.state) {
      const { cartItems, totalAmount, cashReceived, transactionID, employeeID, discountAmount } = location.state;

      setTransaction(prev => ({
        ...prev,
        items: cartItems.map(item => ({
          ...item,
          ProductName: item.ProductName || 'Unknown Product',
          Price: item.Price || 0,
          quantity: item.quantity || 0
        })),
        totalAmount: totalAmount || 0,
        cashReceived: cashReceived || 0,
        change: (cashReceived || 0) - ((totalAmount || 0) - (discountAmount || 0)),
        transactionID: transactionID || null,
        employeeID: employeeID || null,
        discountAmount: discountAmount || 0
      }));
    }

    setLoading(false);
  }, [location.state]);

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
                <span className="text-darkGray">#{transaction.transactionID ? transaction.transactionID.toString().padStart(5, '0') : 'N/A'}</span>
              </div>

              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Employee ID
                </span>
                <span className="text-darkGray">#{transaction.employeeID ? transaction.employeeID.toString().padStart(5, '0') : 'N/A'}</span>
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
                    <span className="py-3">{item.ProductName}</span>
                    <span className="py-3">₱ {item.Price.toFixed(2)}</span>
                    <span className="py-3">{item.quantity} pcs</span>
                    <span className="py-3">₱ {(item.Price * item.quantity).toFixed(2)}</span>
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
                <div className="w-full flex justify-between px-5">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Mode of Payment
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    {transaction.paymentMethod}
                  </span>
                </div>

                {transaction.paymentMethod === 'Digital Wallet' && (
                  <div className="w-full flex justify-between px-5 mt-2">
                    <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                      Reference Number
                    </span>
                    <input
                      type="text"
                      className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                    />
                  </div>
                )}

                <div className="w-full flex justify-between px-5">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Discount
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    ₱ {transaction.discountAmount.toFixed(2)}
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
                onClick={() => navigate("/admin/create-order/")}
              >
                Back to Order Page
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;