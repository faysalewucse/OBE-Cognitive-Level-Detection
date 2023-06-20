import { getDatabase, onValue, ref, set } from "firebase/database";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../utils/Loading";
import { ToastContainer, toast } from "react-toastify";
import Error from "../utils/Error";
import millisToMinutesAndSeconds from "../utils/MilliSecondConverter";

export default function ParticipateQuiz() {
  //getCurrentUserUID
  const { uid } = useAuth().currentUser;

  //page navigator
  const navigate = useNavigate();

  //initiallize variables
  const joinKey = useParams().joinKey;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [quizInfo, setQuizInfo] = useState(undefined);
  const [questions, setQuestions] = useState(undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let flag = false;
    questions.forEach((question) => {
      if (question.required === true && question.answer.length === 0) {
        flag = true;
        toast.error(`Question ${question.id} is required but not answered.`);
        return;
      }
    });

    if (flag) return;

    try {
      setLoading(true);
      const db = getDatabase();
      const participantsRef = ref(
        db,
        `${quizInfo.creator_uid}/myquizes/${joinKey}/participants/${Date.now()
          .toString(36)
          .toUpperCase()}`
      );
      //key for the participants
      const key = `${Date.now().toString(36).toUpperCase()}`;

      const myParticipationRef = ref(db, `${uid}/participations/${key}`);
      await set(participantsRef, {
        participant: uid,
        answers: questions.map((question) => {
          return {
            id: question.id,
            answer: question.answer,
          };
        }),
      });

      await set(myParticipationRef, {
        quizinfo: quizInfo,
        key: key,
        submission: JSON.stringify(questions),
      });
      toast.success("Submitted Answers successfully!");
      setLoading(false);
      setTimeout(() => {
        if (!quizInfo.manualCheck) navigate(`/result/${key}`);
        else navigate("/result/000000");
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }

    //dispatch(controlAddQuizModal());
  };

  useEffect(() => {
    const db = getDatabase();
    const quizRef = ref(db);
    onValue(quizRef, (snapshot) => {
      if (snapshot) {
        snapshot.forEach((childSnapshot) => {
          const { myquizes = "" } = childSnapshot?.val();
          if (myquizes[joinKey]?.joinKey === joinKey) {
            const edit = JSON.parse(myquizes[joinKey]?.questions).map(
              (question) => {
                return { ...question, answer: [] };
              }
            );
            setQuestions(edit);
            return setQuizInfo(myquizes[joinKey]);
          }
        });
      }
      return setError("No Data Available");
    });
  }, [joinKey]);

  //function for set Answer
  const setAnswerHandler = (question, option) => {
    //if the value already exists in the answer [] then remove it
    const removed =
      question.answer.indexOf(option.value) !== -1 &&
      question.answer.splice(question.answer.indexOf(option.value), 1);
    //filtering the answer array
    const answer =
      question.type === "checkbox" //if the question type is checkbox then removed or push value to []
        ? removed // if removed then push removed []
          ? question.answer
          : [...question.answer, option.value] //else push new value to []
        : [option.value];

    setQuestions((prevQuestion) => {
      return [
        ...prevQuestion.map((ques) => {
          if (ques.id === question.id) {
            return {
              ...question,
              answer: answer, // inserting the new answer [] with the value
            };
          }
          return ques;
        }),
      ];
    });
  };

  const setTextAnswer = (e, question) => {
    setQuestions((prevQuestion) => {
      return [
        ...prevQuestion.map((ques) => {
          if (ques.id === question.id) {
            return {
              ...question,
              answer: e.target.value, // inserting simple text answer
            };
          }
          return ques;
        }),
      ];
    });
  };

  console.log(quizInfo);
  return (
    <div className="max-w-7xl mx-auto p-10">
      {/* If Exam time available render questions else render exam info */}
      <div>
        {quizInfo ? (
          <div>
            {quizInfo.startDate < Date.now() || quizInfo.alwaysPublic ? (
              <form onSubmit={handleSubmit}>
                <h4 className="font-bold text-indigo-500">
                  Title: {quizInfo.title}
                </h4>
                {questions.map((question) => {
                  return (
                    <div key={question.id} className="my-5">
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold text-2xl">
                          {question.id}. {question.question}{" "}
                        </h6>
                        <h6 className="text-sm text-indigo-600 font-bold">
                          {question.type === "checkbox"
                            ? "Can be Multiple Answer"
                            : ""}
                          {question.required ? "(required)" : ""}
                        </h6>
                      </div>
                      <div className="ml-5 grid grid-cols-1 md:grid-cols-2">
                        {question.type === "radio" ||
                        question.type === "checkbox" ? (
                          question.options.map((option, index) => {
                            return (
                              <div
                                key={index}
                                onClick={() =>
                                  setAnswerHandler(question, option)
                                }
                                id={`question${question.id}`}
                                className={`flex items-center gap-5 rounded m-2 py-2 px-5 hover:bg-indigo-600 hover:text-white ${
                                  question.answer.indexOf(option.value) !== -1
                                    ? "bg-indigo-600 text-white"
                                    : "bg-indigo-50 border border-indigo-600 text-indigo-500"
                                } transition-all duration-300 rounded-3xl`}
                              >
                                {question.answer.indexOf(option.value) !==
                                  -1 && (
                                  <i className="fa-solid fa-circle-check text-2xl"></i>
                                )}
                                <h6 className="text-lg">{option.value}</h6>
                              </div>
                            );
                          })
                        ) : question.type === "file" ? (
                          <input type="file" />
                        ) : (
                          <textarea
                            type="textarea"
                            className="p-2 mt-3 rounded bg-indigo-200 focus:outline-none focus:shadow-lg"
                            value={question.answer}
                            onChange={(e) => setTextAnswer(e, question)}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
                <Button loading={loading} text={"Submit"} />
              </form>
            ) : (
              <div>
                {new Date(quizInfo.startDate) > Date.now() ? (
                  <div>
                    <h6>Exam not yet started</h6>
                    <h6>
                      {millisToMinutesAndSeconds(
                        new Date(quizInfo.endDate) -
                          new Date(quizInfo.startDate)
                      )}
                    </h6>
                  </div>
                ) : (
                  new Date(quizInfo.endDate) < Date.now() && (
                    <h6>The Exam is Over.</h6>
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div>{!error ? <Loading /> : <Error msg={error} />}</div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
