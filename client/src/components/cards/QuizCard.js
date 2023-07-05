export default function QuizCard({
  quizName,
  duration,
  startDate,
  courseCode,
  section,
}) {
  return (
    <div className="flex flex-col justify-between font-bold bg-white hover:shadow-xl transition-all duration-300 px-5 py-3 rounded-md cursor-pointer h-44">
      <div>
        <div className="flex justify-between">
          <h6 className="text-indigo-500 mb-2 text-lg">{quizName}</h6>
          <h6 className="text-indigo-500 mb-2 text-lg">{courseCode}</h6>
        </div>
        <h6 className="text-indigo-500 w-fit px-6 py-1 rounded-md bg-indigo-100 mb-2">
          Section: {section}
        </h6>

        <div className="flex items-center bg-white rounded-md px-1">
          <ion-icon name="alarm-outline" size="large"></ion-icon>
          <h6 className="ml-1">{duration + " minutes"}</h6>
        </div>
      </div>
      <h6 className="bg-gradient-to-tr to-indigo-500 from-indigo-700 text-white text-sm rounded my-2 py-1 px-2">
        Start: {new Date(startDate).toLocaleString()}
      </h6>
    </div>
  );
}
