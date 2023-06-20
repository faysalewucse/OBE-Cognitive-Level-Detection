import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";

export default function SignupForm() {
  //styles
  const inputStyle = "border-2 border-indigo-600 md:p-2 p-1 rounded md:text-xl";

  //Initialize Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError("Failed to Login! Try again");
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        required
        placeholder="Enter email"
        icon="alternate_email"
        value={email}
        className={inputStyle}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        required
        placeholder="Enter password"
        icon="lock"
        value={password}
        className={inputStyle}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button loading={loading} text="Login" />

      {error && <p className="error text-red-600 text-xl">{error}</p>}

      <div className="md:text-2xl font-bold text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:text-blue-700">
          Sign Up
        </Link>{" "}
        instead.
      </div>
    </form>
  );
}
