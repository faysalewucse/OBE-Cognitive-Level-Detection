import gravatarUrl from "gravatar-url";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  // styles variables
  const authTextStyle =
    "text-white font-bold hover:cursor-pointer hover:text-blue-100";
  //get Current User if Available
  const { currentUser, logout } = useAuth();

  return (
    <div className="bg-indigo-600 h-20 w-full flex justify-between items-center md:px-20 px-5 shadow-lg">
      <Link to="/" className="flex items-center text-white gap-10">
        <h5 className="font-bold text-xs">
          <span className="text-2xl md:text-3xl bg-white text-black px-2 mr-1 rounded-md">
            Q
          </span>
          uizTaker
        </h5>
      </Link>
      {currentUser ? (
        <div className="flex gap-2 items-center">
          <img
            className="object-cover w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-black"
            src={gravatarUrl(currentUser.email, {
              size: 80,
            })}
            alt={currentUser.displayName}
          />
          <h1 className="text-white font-bold text-xs md:text-xl">
            {currentUser.displayName}
          </h1>
          <i
            onClick={() => logout()}
            className="fa-solid fa-right-from-bracket text-white hover:text-indigo-300 text-xl"
          ></i>
        </div>
      ) : (
        <div className="flex gap-5">
          <Link to="/signup" className={authTextStyle}>
            SIGN UP
          </Link>
          <Link to="/login" className={authTextStyle}>
            LOGIN
          </Link>
        </div>
      )}
    </div>
  );
}
