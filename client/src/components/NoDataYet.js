import React from "react";

export default function NoDataYet({ text }) {
  return (
    <div className="text-center text-white">
      <i className="fa-solid fa-ban text-9xl opacity-80 mb-5"></i>
      <h3>{text}</h3>
    </div>
  );
}
