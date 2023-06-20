import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-indigo-700 to-blue-600 h-screen">
      <div className="text-center py-10 max-w-7xl mx-auto grid place-items-center h-screen">
        <div className="">
          <h1 className="font-bold text-white">Welcome to QuizTaker</h1>
          <Link
            to="/login"
            className="text-3xl bg-indigo-800 text-white font-bold py-2 px-6 rounded inline-block mt-10 cursor-pointer hover:bg-indigo-900"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
