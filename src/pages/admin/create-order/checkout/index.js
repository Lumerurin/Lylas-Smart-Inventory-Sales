import React, { useState } from "react";
import Layout from "../../layout";
import { CaretLeft, CheckCircle } from "@phosphor-icons/react";
import Separator from "../../../../components/ui/Separator";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    setIsModalOpen(false);
    // alert("Checkout confirmed!");
  };

  return (
    <Layout>
      {isModalOpen && (
        <div className="w-full h-full inset-0 fixed bg-black/25 z-50 flex justify-center items-center">
          <div className="bg-solidWhite w-2/6 h-2/4 absolute rounded-lg flex flex-col justify-between items-center p-6">
            <div className="flex items-center justify-center flex-col">
              <CheckCircle size={350} color="#4E76CD" />
              <h2 className="text-darkerGray">Transaction Complete!</h2>
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
            <div className="flex items-center justify-center flex-col text-center ">
              {/* <CheckCircle size={350} color="#4E76CD" /> */}
              <h2 className="text-darkerGray font-semibold">
                Are you sure you want to cancel this transaction?
              </h2>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => navigate("/admin/create-order/")}
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
            // onClick={() => navigate("/admin/inventory")}
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
                <span className="text-darkGray">#00000</span>
              </div>

              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Employee ID
                </span>
                <span className="text-darkGray">#000000</span>
              </div>
            </div>

            <div className="w-full grid gap-3">
              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Time
                </span>
                <span className="text-darkGray">11:59 AM</span>
              </div>

              <div className="w-full grid grid-cols-2">
                <span className="font-semibold text-darkerGray text-lg">
                  Date
                </span>
                <span className="text-darkGray">01/01/25</span>
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
              <div className="w-full grid grid-cols-4">
                <span className="py-3">Name</span>
                <span className="py-3">P 0.00</span>
                <span className="py-3">0 pcs</span>
                <span className="py-3">P 0.00</span>
              </div>
              <div className="w-full grid grid-cols-4">
                <span className="py-3">Name</span>
                <span className="py-3">P 0.00</span>
                <span className="py-3">0 pcs</span>
                <span className="py-3">P 0.00</span>
              </div>
              <div className="w-full grid grid-cols-4">
                <span className="py-3">Name</span>
                <span className="py-3">P 0.00</span>
                <span className="py-3">0 pcs</span>
                <span className="py-3">P 0.00</span>
              </div>
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

                <div className="w-full flex justify-between">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Discount
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    P 0.00
                  </span>
                </div>

                <div className="w-full flex justify-between">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Total Amount
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    P 0.00
                  </span>
                </div>

                <div className="w-full flex justify-between">
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    Change
                  </span>
                  <span className="text-darkerGray text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    P 0.00
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons Aligned at Bottom */}
            <div className="w-full flex justify-end gap-3 mt-auto sticky bottom-0  p-5">
              <button
                className="px-6 py-3 bg-gray-300 text-darkerGray rounded-lg hover:scale-105 transition-all duration-200"
                onClick={() => setIsCloseModal(true)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-blueSerenity text-white rounded-lg hover:scale-105 transition-all duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
