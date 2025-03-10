import React, { useState } from "react";
import Layout from "../layout";
import {
  CalendarDots,
  CaretLeft,
  CaretRight,
  CashRegister,
  ChartLine,
  Coins,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Separator from "../../../components/ui/Separator";

const SalesTrackingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const sales = [
    {
      id: 1,
      productID: 101,
      productName: "Laptop",
      price: 50000,
      totalSales: 10,
      totalIncome: 500000,
    },
    {
      id: 2,
      productID: 102,
      productName: "Smartphone",
      price: 20000,
      totalSales: 25,
      totalIncome: 500000,
    },
    {
      id: 3,
      productID: 103,
      productName: "Tablet",
      price: 15000,
      totalSales: 18,
      totalIncome: 270000,
    },
    {
      id: 4,
      productID: 104,
      productName: "Smartwatch",
      price: 8000,
      totalSales: 30,
      totalIncome: 240000,
    },
    {
      id: 5,
      productID: 105,
      productName: "Wireless Headphones",
      price: 5000,
      totalSales: 40,
      totalIncome: 200000,
    },
    {
      id: 6,
      productID: 106,
      productName: "Gaming Mouse",
      price: 2500,
      totalSales: 55,
      totalIncome: 137500,
    },
    {
      id: 7,
      productID: 107,
      productName: "Mechanical Keyboard",
      price: 4500,
      totalSales: 35,
      totalIncome: 157500,
    },
    {
      id: 8,
      productID: 108,
      productName: "Monitor",
      price: 12000,
      totalSales: 22,
      totalIncome: 264000,
    },
    {
      id: 9,
      productID: 109,
      productName: "External Hard Drive",
      price: 7000,
      totalSales: 28,
      totalIncome: 196000,
    },
    {
      id: 10,
      productID: 110,
      productName: "Printer",
      price: 10000,
      totalSales: 15,
      totalIncome: 150000,
    },
    {
      id: 11,
      productID: 111,
      productName: "Router",
      price: 3500,
      totalSales: 60,
      totalIncome: 210000,
    },
    {
      id: 12,
      productID: 112,
      productName: "Webcam",
      price: 3000,
      totalSales: 45,
      totalIncome: 135000,
    },
    {
      id: 13,
      productID: 113,
      productName: "Microphone",
      price: 4000,
      totalSales: 50,
      totalIncome: 200000,
    },
    {
      id: 14,
      productID: 114,
      productName: "Portable Speaker",
      price: 6000,
      totalSales: 32,
      totalIncome: 192000,
    },
    {
      id: 15,
      productID: 115,
      productName: "VR Headset",
      price: 25000,
      totalSales: 8,
      totalIncome: 200000,
    },
    {
      id: 16,
      productID: 116,
      productName: "Smart TV",
      price: 45000,
      totalSales: 6,
      totalIncome: 270000,
    },
    {
      id: 17,
      productID: 117,
      productName: "Projector",
      price: 15000,
      totalSales: 12,
      totalIncome: 180000,
    },
    {
      id: 18,
      productID: 118,
      productName: "Gaming Console",
      price: 35000,
      totalSales: 9,
      totalIncome: 315000,
    },
    {
      id: 19,
      productID: 119,
      productName: "Power Bank",
      price: 2000,
      totalSales: 80,
      totalIncome: 160000,
    },
    {
      id: 20,
      productID: 120,
      productName: "Graphics Card",
      price: 60000,
      totalSales: 5,
      totalIncome: 300000,
    },
  ];
  const filteredSales = sales.filter(
    (sale) =>
      sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.id.toString().includes(searchQuery)
  );
  return (
    <Layout>
      {isModalOpen && (
        <div className="w-full h-full inset-0 fixed bg-black/25 z-50 flex justify-center items-center overflow-y-hidden ">
          <div className="bg-solidWhite w-1/2 h-2/4 absolute rounded-lg flex flex-col justify-between items-center p-6">
            <div className="flex items-center justify-center flex-col w-full ">
              <h2 className="text-darkerGray">Transaction Details</h2>
              <div className="flex flex-col w-full">
                <div className="grid grid-cols-2 my-5 gap-5">
                  <div className=" flex flex-col gap-3">
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-xl text-darkerGray ">
                        Transaction ID
                      </span>
                      <span>#00000</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-xl text-darkerGray ">
                        Employee ID
                      </span>
                      <span>#00000</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-xl text-darkerGray ">
                        Date
                      </span>
                      <span>01/01/25</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-xl text-darkerGray ">
                        Time
                      </span>
                      <span>00:00:00 AM</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-4 w-full mt-5">
                  <span className="font-semibold text-darkerGray">Product</span>
                  <span className="font-semibold text-darkerGray">Price</span>
                  <span className="font-semibold text-darkerGray">
                    Quantity
                  </span>
                  <span className="font-semibold text-darkerGray">
                    Subtotal
                  </span>
                </div>

                <div className="w-full h-full flex flex-col overflow-y-scroll">
                  <div className="grid grid-cols-4 w-full">
                    <span className="py-3">Name</span>
                    <span className="py-3">P 0.00</span>
                    <span className="py-3">0 pcs</span>
                    <span className="py-3">P 0.00</span>
                  </div>

                  <div className="grid grid-cols-4 w-full">
                    <span className="py-3">Name</span>
                    <span className="py-3">P 0.00</span>
                    <span className="py-3">0 pcs</span>
                    <span className="py-3">P 0.00</span>
                  </div>

                  <div className="grid grid-cols-4 w-full">
                    <span className="py-3">Name</span>
                    <span className="py-3">P 0.00</span>
                    <span className="py-3">0 pcs</span>
                    <span className="py-3">P 0.00</span>
                  </div>

                  <div className="grid grid-cols-4 w-full">
                    <span className="py-3">Name</span>
                    <span className="py-3">P 0.00</span>
                    <span className="py-3">0 pcs</span>
                    <span className="py-3">P 0.00</span>
                  </div>

                  <div className="grid grid-cols-4 w-full">
                    <span className="py-3">Name</span>
                    <span className="py-3">P 0.00</span>
                    <span className="py-3">0 pcs</span>
                    <span className="py-3">P 0.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-between items-center">
              <span className="text-2xl font-semibold text-darkerGray">
                TOTAL: P 0.00
              </span>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blueSerenity text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------- */}
      <section className="h-full flex flex-col gap-5 overflow-y-hidden">
        <div className="w-full flex items-center gap-3 ">
          <h1 className="text-blueSerenity py-5 text-lg sm:text-xl text-right w-full">
            {" "}
            Sales Tracking
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-3 md:gap-5 w-full">
          {/* Sales Summary Items */}
          {[
            {
              icon: <Coins size={32} />,
              value: "P30,000.00",
              label: "Total Sales",
            },
            {
              icon: <CashRegister size={40} weight="light" />,
              value: "50",
              label: "Total Transactions",
            },
            {
              icon: <CalendarDots size={32} />,
              value: "P 30,000.00",
              label: "Total Month Sales",
            },
            {
              icon: <ChartLine size={32} />,
              value: "P 30,000.00",
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
              placeholder="Search by name or product number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlass size={32} className="absolute ml-3" />
          </div>

          <div className="flex items-center">
            <input
              type="date"
              className="flex items-center gap-2 bg-blueSerenity text-white px-4 rounded-lg shadow-md hover:scale-110 transition-all duration-300 w-fit uppercase"
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
              Date
            </span>
            <span className="font-semibold text-darkGray text-xs sm:text-sm md:text-base text-left">
              Time
            </span>
            <span className="font-semibold text-darkGray text-xs sm:text-sm md:text-base text-left">
              Subtotal
            </span>
          </div>

          <div className="w-full h-full overflow-y-scroll flex flex-col gap-3 ">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-solidWhite w-full rounded-lg p-5 grid grid-cols-6 items-center"
                >
                  <span className="text-darkGray">#{sale.id}</span>
                  <span>{sale.productName}</span>
                  <span>P {sale.price.toFixed(2)}</span>
                  <span>{sale.totalSales}</span>
                  <span>P {sale.totalIncome.toFixed(2)}</span>
                  <CaretRight
                    size={28}
                    color="#4E76CD"
                    className="hover:scale-110 transition-all duration-200 hover:cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-5">
                No matching results found.
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SalesTrackingPage;
