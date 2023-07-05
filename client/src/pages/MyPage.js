import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/cards/QuizCard";
import ParticipateQuizModal from "../components/modals/ParticipateQuizModal";
import NoDataYet from "../components/NoDataYet";
import { useAuth } from "../contexts/AuthContext";
import { controlParticipateModal } from "../features/modal/modalSlice";
import png1 from "../assets/png1.png";
import png2 from "../assets/png2.png";
import axios from "axios";

export default function MyPage() {
  //get current user UID
  const { email } = useAuth().currentUser;

  //style
  const navLinkStyle =
    "border rounded text-white hover:opacity-100 cursor-pointer px-4 py-2 text-sm font-bold";
  //all data
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/questions?email=${email}`
        );

        setQuestions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [email]);

  const participateHandler = () => {
    dispatch(controlParticipateModal());
  };

  return (
    <div className="bg-gradient-to-b from-indigo-700 to-blue-600 h-screen">
      <div className="max-w-7xl mx-auto p-10">
        <div className="flex flex-wrap justify-between gap-1 mb-2 md:mb-5 text-xs md:text-md">
          <div className="flex gap-2">
            <h6 className={`${navLinkStyle}`}>My Questions</h6>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={participateHandler}
              className="bg-white hover:from-blue-900 hover:to-blue-600 p-2 md:px-4 font-semibold rounded float-right"
            >
              Participate in Quiz
            </button>
            <button
              onClick={() => navigate("/createQuiz")}
              className="lg:hidden bg-white hover:scale-105 transition-all duration-300 hover:from-blue-900 hover:to-blue-600 px-4 font-semibold rounded float-right"
            >
              Create Quiz +
            </button>
          </div>
        </div>
        <div className="border-t-2 border-indigo-400 rounded py-10">
          <div>
            {questions?.length !== 0 ? (
              <div>
                <h3 className="font-bold mb-5 text-white">My Questions</h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-5">
                  {questions?.map((question, index) => {
                    console.log(question);
                    return (
                      <div
                        key={index}
                        onClick={() => navigate(`/editQuiz/${question._id}`)}
                      >
                        <QuizCard
                          quizName={question.courseTitle}
                          courseCode={question.courseCode}
                          section={question.section}
                          date={question.examDate}
                          duration={question.examDuration}
                          startDate={question.examDate}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <NoDataYet text={"You didn't created any quiz yet!"} />
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/createQuiz")}
          className="invisible lg:visible md:absolute md:my-0 my-5 bottom-10 right-10 bg-white px-4 py-2 font-semibold rounded float-right"
        >
          Create Quiz +
        </button>

        <div className="invisible lg:visible fixed top-1/2 right-5">
          <img src={png1} alt="png1" />
        </div>
        <div className="invisible lg:visible fixed bottom-5 left-5">
          <img src={png2} alt="png2" />
        </div>
        <ParticipateQuizModal />
      </div>
    </div>
  );
}
