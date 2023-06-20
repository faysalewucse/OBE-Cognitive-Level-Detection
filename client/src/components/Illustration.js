import React from "react";

export default function Illustration({ heading }) {
  return (
    <div className="flex flex-col justify-center gap-10 text-center">
      <h5 className="font-bold lg:text-4xl mb-5">{heading}</h5>
      <img
        className="md:w-[500px] w-[250px] mx-auto"
        src="images/signup.svg"
        alt="signup"
      />
    </div>
  );
}
