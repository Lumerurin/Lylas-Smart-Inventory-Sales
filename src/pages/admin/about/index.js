import React from "react";
import Layout from "../layout";
import logo from "../../login/logo.svg";
import map from "../../../img/map.png";

const AboutPage = () => {
  return (
    <Layout>
      <section className="h-full flex flex-col">
        <div className="w-full flex items-center gap-3">
          <h1 className="text-blueSerenity py-5">About</h1>
        </div>

        <div className="flex items-center w-full justify-between px-40">
          {/* about info */}
          <div className="flex flex-col items-center justify-center max-w-screen-md">
            <img src={logo} alt="logo" />

            <div className="flex flex-col gap-5">
              <p className="text-center">
                Lyla's Cakes, Pastries, & Breads is a Davao City-based bakery
                located at Padre Gomez Corner, Roxas Avenue, Philippines.
                Founded in 2019 by Ms. Layla Alexys Dabon during her Grade 10
                year, the business started with her vision of opening a café
                after graduation.
              </p>

              <p className="text-center">
                Committed to providing affordable and high-quality baked goods,
                Lyla's Cakes, Pastries, & Breads has grown into a trusted name
                in the local baking industry. 
              </p>
            </div>
          </div>
          {/* image */}
          <div className="w-fit mt-autos">
            <img src={map} alt="logo" />
          </div>
        </div>
      </section>
      <div className="h-screen bg-cookieBG bg-blue-800 flex justify-center items-center">
        <div className="flex flex-col items-center ">
          <h1 className="text-white max-w-5xl text-center">
            Lyla’s Transaction Processing and Inventory Management System
          </h1>

          <div className="w-full flex justify-center gap-5">
            <div className="bg-white/20 w-80 h-80 text-white rounded-lg text-center flex justify-center">
              <span>
                Develop a system for digital record-keeping with centralized
                data access.
              </span>
            </div>

            <div className="bg-white/20 w-80 h-80 text-white rounded-lg text-center flex justify-center">
              <span>
                Develop a system for digital record-keeping with centralized
                data access.
              </span>
            </div>

            <div className="bg-white/20 w-80 h-80 text-white rounded-lg text-center flex justify-center">
              <span>
                Develop a system for digital record-keeping with centralized
                data access.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;