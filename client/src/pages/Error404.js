import { useNavigate } from "react-router-dom";
import { GiNinjaStar } from "react-icons/gi";
import Button from "../components/Button";

export default function Error404() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="max-w-7xl mx-auto p-10">
        <div className="text-center md:absolute md:top-40 md:left-1/2 md:transform md:-translate-x-1/2">
          <h1 className="flex items-center  justify-center text-8xl md:text-9xl font-bold text-primary">
            4{" "}
            <span>
              <GiNinjaStar />
            </span>{" "}
            4
          </h1>
          <h1 className="my-2 text-gray-800 font-bold text-3xl md:text-5xl">
            Page not found!
          </h1>
          <p className="my-2 text-gray-800 font-semibold">
            Sorry about that! Please visit hompage to get where you need to go.
          </p>
        </div>
        <Button
          text={"Take me to Home Page!"}
          className="md:w-1/4 w-full mx-auto md:absolute md:bottom-20 md:left-1/2 md:transform md:-translate-x-1/2"
          onClickHandler={() => navigate("/")}
        />
      </div>
    </div>
  );
}
