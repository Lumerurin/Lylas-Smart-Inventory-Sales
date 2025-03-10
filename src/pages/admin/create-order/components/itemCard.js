import React from "react";

export const ItemCard = ({ itemName, img }) => {
  return (
    <section className="flex flex-col items-center gap-2">
      <div className="h-[9.5rem] w-[9.5rem] bg-lightGray shadow-lg rounded-lg">
        <img
          src={img}
          alt=""
          className=" w-full h-full object-cover rounded-lg"
        />
      </div>
      <label className="font-semibold max-w-[9rem] text-center">
        {itemName}
      </label>
    </section>
  );
};
