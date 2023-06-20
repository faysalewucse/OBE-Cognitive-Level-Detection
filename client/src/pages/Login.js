import Illustration from "../components/Illustration";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="max-w-7xl mx-auto p-10 md:flex gap-20 justify-center items-center h-screen">
      <Illustration heading={"Login to Your Account"} />
      <div className="md:mt-0 mt-[10%]">
        <LoginForm />
      </div>
    </div>
  );
}
