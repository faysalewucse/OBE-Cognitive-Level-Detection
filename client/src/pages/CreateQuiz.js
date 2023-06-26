import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ewuLogo from "../assets/ewuLogo.png";
import axios from "axios";

export default function CreateQuiz() {
  //get current user
  const { displayName, email } = useAuth().currentUser;

  //Variables
  const [instructor, setInstructor] = useState(""); //question title
  const [fullMarks, setFullMarks] = useState(""); //question title
  const [courseCode, setCourseCode] = useState(""); //question title
  const [courseTitle, setCourseTitle] = useState(""); //question title
  const [section, setSection] = useState(""); //question title
  const [notes, setNotes] = useState(""); //question title
  const [examDuration, setExamDuration] = useState(""); //question title
  const [examDate, setExamDate] = useState("dd/mm/yyyy"); //question title
  const [examType, setExamType] = useState(""); //question title
  const [semester, setSemester] = useState(""); //question title
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      type: "radio",
      mark: 0,
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post(
        "http://127.0.0.1:5000/addQuestion",
        {
          questions: questions,
          userEmail: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  //Add Question Function
  const addQuestionHandler = () => {
    setQuestions((prevQuestions) => {
      return [
        ...prevQuestions,
        {
          id: prevQuestions.length + 1,
          question: "",
          type: "radio",
          marks: 0,
        },
      ];
    });
  };

  // Handle Question
  const handleQuestion = (e, question) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((q) => {
        if (q.id === question.id) {
          return {
            ...q,
            question: e.target.value,
          };
        } else return q;
      });
    });
  };

  //Handle Marks
  const markHandler = (e, question) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((q) => {
        if (q.id === question.id) {
          return {
            ...q,
            mark: e.target.value,
          };
        } else return q;
      });
    });
  };

  //Remove Question Function
  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions((prevQuestions) => {
        return prevQuestions.filter((question) => question.id !== id);
      });
    } else {
    }
  };

  return (
    <div className="relative bg-indigo-100 min-h-screen p-10">
      <div className="max-w-screen-2xl mx-auto flex">
        <div className="md:px-20 p-2 flex-grow">
          <h3 className="text-center font-extrabold text-gray-900">
            Questions
          </h3>
          <form className="mt-8" onSubmit={handleSubmit}>
            <input
              type="date"
              name="date"
              id="date"
              className="p-2 focus:outline-none rounded"
              onChange={(e) => {
                const newDate = new Date(e.target.value).toLocaleDateString(
                  "en-GB"
                );
                setExamDate(newDate);
              }}
            />
            <div className="mt-2 flex gap-2">
              <input
                name="exam"
                type="text"
                required
                className="rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
                placeholder="Exam. Ex: Mid 1, Mid 2, Final"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              />
              <input
                name="semester"
                type="text"
                required
                className="rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
                placeholder="Semester Ex:Fall2023"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className="flex gap-2 my-2">
              <input
                name="course_code"
                type="text"
                required
                className="rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
                placeholder="Course Code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
              <input
                name="course_title"
                type="text"
                required
                className="rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
                placeholder="Course title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
              <input
                name="section"
                type="text"
                required
                className="rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
                placeholder="Section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </div>

            <input
              name="instructor"
              type="text"
              required
              className="mb-2 rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
              placeholder="Instructor"
              defaultValue={displayName}
              onChange={(e) => setInstructor(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                name="duration"
                type="number"
                required
                className="rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
                placeholder="Duration (in minutes)"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
              />
              <input
                name="fullMarks"
                type="number"
                required
                className="rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
                placeholder="Full Marks"
                value={fullMarks}
                onChange={(e) => setFullMarks(e.target.value)}
              />
            </div>
            <textarea
              name="notes"
              required
              className="mt-2 rounded w-full p-2 focus:z-10 focus:outline-none focus:shadow-md shadow-sm"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {questions?.map((question, index) => {
              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm my-3 p-2`}
                >
                  <div className={`relative flex justify-between items-center`}>
                    <div className="w-full p-2 rounded-lg">
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <h6>{index + 1}.</h6>
                        <textarea
                          name="question"
                          type="text"
                          required
                          rows={1}
                          className="flex-grow font-bold rounded relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                          placeholder="Question"
                          value={question.question}
                          onChange={(e) => handleQuestion(e, question)}
                        />

                        <input
                          type="number"
                          className="md:mt-0 p-2 border focus:outline-none rounded w-24"
                          placeholder="Mark(s)"
                          required
                          onChange={(e) => markHandler(e, question)}
                        />
                      </div>
                    </div>
                    <i
                      onClick={() => removeQuestion(question.id)}
                      className="fa-solid fa-trash cursor-pointer hover:text-red-600 text-red-500"
                    ></i>
                  </div>
                </div>
              );
            })}
            <div>
              <h6
                onClick={addQuestionHandler}
                className="rounded-sm py-1 text-center text-white my-5 bg-blue-800 cursor-pointer hover:bg-blue-900"
              >
                + Add Question
              </h6>
            </div>
            <Button loading={loading} text="Create" />
          </form>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            theme="dark"
          />
        </div>
        <div className="md:px-20 p-2">
          <h3 className="text-center font-extrabold text-gray-900">Output</h3>
          <div className="tinos bg-white min-h-[877px] mt-5 rounded w-[620px] p-5 text-[10px]">
            <h6 className="block text-end text-sm">{examDate}</h6>
            <div className="font-bold flex gap-2 justify-center items-center ">
              <img className="w-1/6" src={ewuLogo} alt="ewuLogo" />
              <div className="">
                <h6>East West University</h6>
                <p>Department of Computer Science and Engineering</p>
                <p>B.Sc. in Computer Science and Engineering Program</p>
                <p>
                  {examType} Examination, {semester} Semester
                </p>
              </div>
            </div>
            <div className="px-28 font-semibold mt-5">
              <p>
                Course: {courseCode || "CSEXXX"}, {courseTitle || "XXXX XXXX"},
                Section: {section || 0}
              </p>
              <p>Instructor: {instructor || ""}</p>
              <p>Full Marks: {fullMarks || 0}</p>
              <p>Time: {examDuration || 0} Minutes</p>
            </div>
            <pre>
              <b>Note:</b> <br />
              {notes || ""}
            </pre>
            <hr className="border border-gray-300 my-3" />
            <div>
              {questions?.map((question, index) => {
                return (
                  <div className="flex items-center gap-2">
                    <p>{index + 1}.</p>
                    <p className="break-words w-[480px]">
                      {question?.question}
                    </p>
                    <p className="font-bold">
                      [CO3, C1, Marks {question.mark}]
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <button className="block mt-5 text-white rounded py-2 px-6 w-full bg-indigo-500">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
