import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { List } from "@phosphor-icons/react";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row max-h-screen h-screen">
      {/* Left Sidebar (if any, otherwise remove) */}
      {/* <div className="hidden md:block w-64 bg-gray-800 text-white">
      </div> */}

      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-hidden">
      <main className=" bg-white flex-1 scroll-smooth overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
