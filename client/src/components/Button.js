import React from "react";

export default function Button({ loading, text, style }) {
  return (
    <button
      disabled={loading}
      type="submit"
      className={`w-full bg-blue-500 p-2 text-white rounded hover:bg-blue-600 ${style}`}
    >
      <div className="flex items-center justify-center">
        {loading ? (
          <span className="border h-6 w-6 border-white animate-spin rounded-full"></span>
        ) : (
          <span>{text}</span>
        )}
      </div>
    </button>
  );
}
