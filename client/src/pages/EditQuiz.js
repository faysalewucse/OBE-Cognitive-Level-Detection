import { useEffect, useState } from "react";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "react-switch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import copy from "copy-to-clipboard";

export default function EditQuiz() {
  const joinKey = useParams().joinKey;
  const [clipBoard, setClipboard] = useState(false);

  const clipBoardHandler = () => {
    copy(`https://quiztaker.netlify.app/participateQuiz/${joinKey}`);
    setClipboard(true);
    setTimeout(() => {
      setClipboard(false);
    }, 1000);
  };

  // For Edit Questions
  //page navigator
  const navigate = useNavigate();
  //get current user
  const { uid, displayName } = useAuth().currentUser;

  //Variables
  const [title, setTitle] = useState(""); //question title
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [alwaysPublic, setAlwaysPublic] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  // const [emails, setEmails] = useState([]);
  // const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [{ id: 1, value: "" }],
      type: "radio",
      required: false,
      correct_answer: [],
      mark: 0,
    },
  ]);

  useEffect(() => {
    const db = getDatabase();
    const quizRef = ref(db, `${uid}/myquizes/${joinKey}/`);
    onValue(quizRef, (snapshot) => {
      const { title, alwaysPublic, questions, startDate, endDate } =
        snapshot.val();

      setTitle(title);
      setQuestions(JSON.parse(questions));
      setAlwaysPublic(alwaysPublic);
      setStartDate(startDate);
      setEndDate(endDate);
    });
  }, [joinKey, uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!alwaysPublic) {
      if (Date.now() > startDate || startDate > endDate) {
        return toast.error(
          "Start Time should greater then present Time and End Time should greater then start Time"
        );
      }
    }

    try {
      setLoading(true);
      const db = getDatabase();
      const quizRef = ref(db, `${uid}/myquizes/${joinKey}`);
      await update(quizRef, {
        title: title,
        joinKey: quizRef.key,
        creator_uid: uid,
        creator_name: displayName,
        created_time: Date.now(),
        duration: alwaysPublic ? "0" : new Date(endDate) - new Date(startDate),
        startDate: alwaysPublic ? "null" : startDate.toString(),
        endDate: alwaysPublic ? "null" : endDate.toString(),
        alwaysPublic: alwaysPublic,
        questions: JSON.stringify(questions),
      });
      toast.success("Assesment added successfully!");
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
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
          options: [{}],
          type: "radio",
          correct_answer: [],
          marks: 0,
        },
      ];
    });
  };

  //Type Change Function
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
  //Type Change Function
  const handleType = (e, question) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((q) => {
        if (q.id === question.id) {
          return {
            ...q,
            type: e.target.value,
          };
        } else return q;
      });
    });
  };

  //Add Option Function
  const handleOption = (question) => {
    if (question.options.length < 4) {
      setQuestions((prevQuestions) => {
        return prevQuestions.map((q) => {
          if (q.id === question.id) {
            return {
              ...q,
              options: [...q.options, { id: q.options.length + 1, value: "" }],
            };
          } else return q;
        });
      });
    } else {
      toast.error("More Than 4 Options is not allowed");
    }
  };

  //Option Onchange Function
  const setOptionValue = (e, question, id) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((q) => {
        if (q.id === question.id) {
          return {
            ...q,
            options: q.options.map((option) => {
              if (id === option.id) {
                return {
                  id: id,
                  value: e.target.value,
                };
              } else return option;
            }),
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

  //Delete Option Function
  const deleteOptionHandler = (question, index) => {
    if (question?.options.length > 1) {
      setQuestions((prevQuestions) => {
        return prevQuestions.filter((ques) => {
          if (ques.id === question.id) {
            question.correct_answer = [];
            return (question.options = ques.options.filter(
              (option) => option.id !== index
            ));
          }
          return ques;
        });
      });
    } else {
    }
  };

  const setcorrect_answerHandler = (question, option) => {
    //if the value already exists in the correct_answer [] then remove it
    const removed =
      question.correct_answer.indexOf(option.value) !== -1 &&
      question.correct_answer.splice(
        question.correct_answer.indexOf(option.value),
        1
      );
    //filtering the correct_answer array
    const correct_answer =
      question.type === "checkbox" //if the question type is checkbox then removed or push value to []
        ? removed // if removed then push removed []
          ? question.correct_answer
          : [...question.correct_answer, option.value] //else push new value to []
        : [option.value];

    setQuestions((prevQuestion) => {
      return [
        ...prevQuestion.map((ques) => {
          if (ques.id === question.id) {
            return {
              ...question,
              correct_answer: correct_answer, // inserting the new correct_answer [] with the value
            };
          }
          return ques;
        }),
      ];
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-5 md:p-10">
      <h6 className="font-bold">
        <span>Join Link: </span>
        <div className="text-sm flex items-center mb-5">
          <p
            onClick={clipBoardHandler}
            className="cursor-pointer break-words font-bold text-blue-500 mr-5 box-content"
          >
            https://quiztaker.netlify.app/participateQuiz/{joinKey}{" "}
          </p>
          <i
            onClick={clipBoardHandler}
            className="fa-solid fa-share-nodes cursor-pointer text-black"
          ></i>
        </div>
      </h6>
      {clipBoard && (
        <span className="bg-black my-2 text-white p-1 rounded text-center">
          Copied To Clipboard
        </span>
      )}
      <div className="bg-indigo-50 p-10 rounded-lg">
        <h3 className="text-center font-extrabold text-gray-900">Questions</h3>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mt-5">
            <input
              name="title"
              type="text"
              required
              className="md:text-lg rounded w-full p-3 focus:z-10 focus:outline-none focus:shadow-md sm:text-sm shadow-sm font-bold"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-between my-5">
            <label className="flex items-center gap-5">
              <span className="font-bold">Always On for Exam</span>
              <Switch
                onChange={() => setAlwaysPublic(!alwaysPublic)}
                checked={alwaysPublic}
              />
            </label>
            <label className="flex items-center gap-5">
              <span className="font-bold">Set Target Emails</span>
              <Switch
                className="inline"
                onChange={() => setPrivacy(!privacy)}
                checked={privacy}
              />
            </label>
          </div>

          {privacy && (
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Features is Not Available. Just Keep The Join Key Secret"
                className="w-full p-2"
              />
            </div>
          )}
          {!alwaysPublic ? (
            <div className="field md:flex justify-between my-5">
              <div className="md:flex gap-5 items-center">
                <h6 className="font-bold w-full">Exam start Time</h6>
                <DatePicker
                  selected={new Date(startDate)}
                  className="p-2 rounded-md focus:outline-none shadow-sm hover:shadow-md"
                  showTimeSelect
                  dateFormat="Pp"
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div className="md:flex gap-5 items-center">
                <h6 className="font-bold w-full">Exam end time</h6>
                <DatePicker
                  selected={new Date(endDate)}
                  className="p-2 rounded-md focus:outline-none shadow-sm hover:shadow-md"
                  showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
            </div>
          ) : null}
          {questions?.map((question, index) => {
            return (
              <div
                key={index}
                className={`bg-white rounded-lg text-xl shadow-sm my-3 p-2`}
              >
                <div className={`relative flex justify-between text-sm`}>
                  <div className="w-full p-2 rounded-lg">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <h6>{index + 1}.</h6>
                      <input
                        name="question"
                        type="text"
                        required
                        className="font-bold rounded relative block md:w-2/3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                        placeholder="Question"
                        value={question.question}
                        onChange={(e) => handleQuestion(e, question)}
                      />
                      <select
                        name="type"
                        id="question-type"
                        className="border border-gray-300 p-1.5 rounded w-1/3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                        onChange={(e) => handleType(e, question)}
                      >
                        <option value="radio">Radio</option>
                        <option value="checkbox">CheckBox</option>
                      </select>
                      <input
                        type="number"
                        className="mt-2 md:mt-0 border pl-2 h-8 border-black focus:outline-none rounded"
                        placeholder="Enter Mark(s)"
                        required
                        value={question.mark}
                        onChange={(e) => markHandler(e, question)}
                      />
                    </div>
                    <div className="md:flex justify-between mt-2">
                      <div className="md:ml-10 mt-2">
                        <div>
                          <div>
                            {question?.options.map((option, index) => {
                              return (
                                <div
                                  key={index}
                                  className={`flex gap-2 items-center my-1 p-2 ${
                                    question.correct_answer.indexOf(
                                      option.value
                                    ) !== -1 &&
                                    "bg-indigo-600 rounded-md text-white"
                                  }`}
                                >
                                  <div
                                    onClick={() =>
                                      setcorrect_answerHandler(question, option)
                                    }
                                  >
                                    {question.type === "radio" && (
                                      <ion-icon name="radio-button-off-outline"></ion-icon>
                                    )}
                                    {question.type === "checkbox" && (
                                      <ion-icon name="square-outline"></ion-icon>
                                    )}
                                  </div>

                                  <input
                                    type="text"
                                    className="border rounded px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                    onChange={(e) =>
                                      setOptionValue(e, question, option.id)
                                    }
                                    required
                                    defaultValue={option.value}
                                    placeholder={`Option ${index + 1}`}
                                  />

                                  {index === question.options.length - 1 && (
                                    <i
                                      onClick={() =>
                                        deleteOptionHandler(question, index + 1)
                                      }
                                      className="fa-solid fa-circle-xmark opacity-70 hover:opacity-100"
                                    ></i>
                                  )}
                                </div>
                              );
                            })}

                            <h1
                              onClick={() => handleOption(question)}
                              className="text-center mt-2 cursor-pointer bg-blue-700 text-white text-sm md:font-bold rounded hover:bg-blue-800 p-1"
                            >
                              Add Option+
                            </h1>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          {(question.type === "radio" ||
                            question.type === "checkbox") &&
                            question.correct_answer.length === 0 && (
                              <div className="flex gap-2">
                                <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                                <span className="text-red-400">
                                  correct_answer(s) Not Selected.Please Select
                                  correct_answer(s).
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <i
                  onClick={() => removeQuestion(question.id)}
                  className="fa-solid fa-trash cursor-pointer opacity-50 hover:opacity-100"
                ></i>
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
          <Button loading={loading} text="Save and Exchange" />
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
    </div>
  );
}
