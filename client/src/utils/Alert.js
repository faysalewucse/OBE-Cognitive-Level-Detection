import React from "react";

export default function Alert({ msg, color }) {
  return (
    <div className={`text-center ${color} text-white rounded-sm mt-2`}>
      {msg}
    </div>
  );
}
