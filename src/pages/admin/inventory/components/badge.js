import React from "react";

export const Badge = ({ id }) => {
  const types = {
    1: { color: "bg-goldenYellow", text: "School Event" },
    2: { color: "bg-blueTranquil", text: "Social Event" },
    3: { color: "bg-whiteStoic", text: "Workshop" },
    4: { color: "bg-greenLight", text: "Others" },
  };

  const { color, text } = types[id] || {
    color: "bg-gray-500",
    text: "Unknown",
  };

  return (
    <div className={`${color} rounded-lg text-center w-32 p-3 text-darkerGray`}>
      {text}
    </div>
  );
};
