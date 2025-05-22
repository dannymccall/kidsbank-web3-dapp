import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen parent-div w-full gap-2">
      <div
      className="animate-wave-delay-1"
        style={{
          backgroundColor: "rgb(72,48,214)",
          width: "20px",
          height: "20px",
          borderRadius: 50,
        }}
      ></div>
      <div
       className="animate-wave-delay-2"
        style={{
          backgroundColor: "rgb(26,26,28)",
          width: "20px",
          height: "20px",
          borderRadius: 50,
        }}
      ></div>
      <div
       className="animate-wave-delay-3"
        style={{
          backgroundColor: "rgb(0,211,145)",
          width: "20px",
          height: "20px",
          borderRadius: 50,
        }}
      ></div>
      <div
       className="animate-wave-delay-4"
        style={{
          backgroundColor: "rgb(255,132,154)",
          width: "20px",
          height: "20px",
          borderRadius: 50,
        }}
      ></div>
    </div>
  );
};

export default Loader;
