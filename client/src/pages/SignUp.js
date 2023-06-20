import Illustration from "../components/Illustration";
import SignupForm from "../components/SignUpForm";

export default function Signup() {
  return (
    <div className="max-w-7xl mx-auto p-10 md:flex justify-between gap-20 items-center h-screen">
      <Illustration heading={"Create an Account"} />
      <div className="mt-[10%]">
        <SignupForm />
      </div>
    </div>
  );
}
