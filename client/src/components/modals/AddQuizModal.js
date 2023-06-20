import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { controlAddQuizModal } from "../../features/modal/modalSlice";
import Alert from "../../utils/Alert";
import { getDatabase, ref, set } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

export default function AddQuizModal() {
  //Dispatcher
  const dispatch = useDispatch();

  //initial Variables
  const { addQuizModal: open } = useSelector((state) => state.modal) || {};

  //get current user
  const { uid } = useAuth().currentUser;

  //Variables
  const [title, setTitle] = useState("");
  const [alertVisibility, setalertVisibility] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      options: [{ id: 1, value: "" }],
      type: "radio",
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const quizRef = ref(db, `${uid}/myquizes/${Date.now()}`);
    await set(quizRef, {
      title: title,
      questions: JSON.stringify(questions),
    });
    //dispatch(controlAddQuizModal());
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
      setalertVisibility(true);
      setTimeout(() => {
        setalertVisibility(false);
      }, 5000);
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

  //Option Deletion Function
  const deleteOptionHandler = (question, index) => {
    if (question?.options.length > 1) {
      setQuestions((prevQuestions) => {
        return prevQuestions.filter((ques) => {
          if (ques.id === question.id) {
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
  return (
    open && (
      <>
        <div
          onClick={() => {
            dispatch(controlAddQuizModal());
            setTitle("");
          }}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-3/4 h-4/5 overflow-auto lg:w-2/5 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h3 className="mt-6 text-center font-extrabold text-gray-900">
            Make Questions
          </h3>
          <form className="mt-8" onSubmit={handleSubmit}>
            <div>
              <input
                name="title"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-blue-500 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {questions?.map((question, index) => {
              return (
                <div className="flex justify-between my-3">
                  <div
                    key={1}
                    className="w-full p-2 border border-blue-500 rounded-l border-l-8"
                  >
                    <div>
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <h6>{index + 1}.</h6>
                        <input
                          name="title"
                          type="text"
                          required
                          className="appearance-none rounded relative block w-2/3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Question"
                          value={question[index]}
                          onChange={(e) => handleQuestion(e, question)}
                        />
                        <select
                          name="type"
                          id="question-type"
                          className="border border-gray-300 p-1.5 rounded w-1/3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                          onChange={(e) => handleType(e, question)}
                        >
                          <option
                            value="radio"
                            selected={question.type === "radio"}
                          >
                            Radio
                          </option>
                          <option
                            value="checkbox"
                            selected={question.type === "checkbox"}
                          >
                            CheckBox
                          </option>
                          <option
                            value="text"
                            selected={question.type === "text"}
                          >
                            Dropdown
                          </option>
                          <option
                            value="file"
                            selected={question.type === "file"}
                          >
                            File Uplaod
                          </option>
                        </select>
                      </div>
                      <div className="md:ml-10 mt-2">
                        <div>
                          {question.type !== "file" ? (
                            question?.options.map((option, index) => {
                              return (
                                <div
                                  key={index}
                                  className="flex gap-2 items-center my-1"
                                >
                                  {question.type === "radio" && (
                                    <ion-icon name="radio-button-off-outline"></ion-icon>
                                  )}
                                  {question.type === "checkbox" && (
                                    <ion-icon name="square-outline"></ion-icon>
                                  )}

                                  <input
                                    type="text"
                                    className="border px-2"
                                    onChange={(e) =>
                                      setOptionValue(e, question, option.id)
                                    }
                                    defaultValue={option.value}
                                    placeholder={`Option ${index + 1}`}
                                  />
                                  <ion-icon
                                    onClick={() =>
                                      deleteOptionHandler(question, index + 1)
                                    }
                                    name="close-circle"
                                  ></ion-icon>
                                </div>
                              );
                            })
                          ) : (
                            <input type="file" />
                          )}
                          {question.type !== "file" && (
                            <h1
                              onClick={() => handleOption(question)}
                              className="text-center md:w-1/4 w-2/5 mt-2 cursor-pointer bg-blue-700 text-white text-sm md:font-bold rounded hover:bg-blue-800"
                            >
                              Add Option+
                            </h1>
                          )}
                          {alertVisibility && (
                            <Alert
                              msg={"More then 4 option is not allow!"}
                              color={"bg-red-500"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => removeQuestion(question.id)}
                    className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 w-5 text-center text-white rounded-r"
                  >
                    <ion-icon name="close-circle"></ion-icon>
                  </div>
                </div>
              );
            })}
            <div>
              <h6
                onClick={addQuestionHandler}
                className="block mx-auto md:w-1/2 w-2/4 rounded-sm py-1 text-center text-white my-5 bg-blue-800 cursor-pointer hover:bg-blue-900"
              >
                Add Question
              </h6>
            </div>

            <div className="absolute">
              <p>Set Start and End Date & Time</p>
              <DateRangePicker
                format="yyyy-MM-dd HH:mm:ss"
                defaultCalendarValue={[
                  new Date("2022-02-01 00:00:00"),
                  new Date("2022-05-01 23:59:59"),
                ]}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </>
    )
  );
}
