import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

const DropdownSelect = ({ label, options, onChange }) => {
  const [selected, setSelected] = useState(options[0]); // Default to first option
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    onChange(option); // Pass selected value to parent component
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Label */}
      {label && (
        <label className="block mb-2 text-gray-700 font-medium">{label}</label>
      )}

      {/* Dropdown container */}
      {/* <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"> */}
      <span>{selected}</span>
      {/* Dropdown Icon Button */}
      {/* <button type="button" onClick={() => setIsOpen(!isOpen)}> */}
      <CaretDown size={20} weight="light" onClick={() => setIsOpen(!isOpen)} />
      {/* </button> */}
      {/* </div> */}

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 w-56">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSelect;
