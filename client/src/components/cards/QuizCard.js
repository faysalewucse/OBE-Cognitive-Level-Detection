import React from "react";
import millisToMinutesAndSeconds from "../../utils/MilliSecondConverter";

export default function QuizCard({
  quizName,
  duration,
  startDate,
  endDate,
  alwaysPublic,
}) {
  return (
    <div className="flex flex-col justify-between font-bold bg-white hover:shadow-xl transition-all duration-300 p-5 rounded-md cursor-pointer h-44">
      <div>
        <h6 className="text-indigo-500 mb-2">{quizName}</h6>
        <div className="flex items-center bg-white rounded-md px-1">
          <ion-icon name="alarm-outline" size="large"></ion-icon>
          <h6 className="ml-1">
            {alwaysPublic
              ? "Unlimited"
              : millisToMinutesAndSeconds(duration) + " minutes"}
          </h6>
        </div>
      </div>
      <div>
        {alwaysPublic ? (
          <h6 className="bg-gradient-to-tr to-indigo-500 from-indigo-700 text-white text-sm rounded py-2 text-center">
            Always Open
          </h6>
        ) : (
          <div>
            <h6 className="bg-gradient-to-tr to-indigo-500 from-indigo-700 text-white text-sm rounded my-2 py-1 px-2">
              Start: {new Date(startDate).toLocaleString()}
            </h6>
            <h6 className="bg-gradient-to-tr to-indigo-500 from-indigo-700 text-white text-sm rounded py-1 px-2">
              End: {new Date(endDate).toLocaleString()}
            </h6>
          </div>
        )}
      </div>
    </div>
  );
}
