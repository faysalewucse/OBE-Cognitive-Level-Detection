import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";

export default function SignupForm() {
  //styles
  const inputStyle = "border-2 border-indigo-600 md:p-2 p-1 rounded md:text-xl";

  //Initialize Variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // do validation
    if (password !== confirmPassword) {
      return setError("Passwords don't match!");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password, username);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter name"
        icon="person"
        required
        value={username}
        className={inputStyle}
        onChange={(e) => setUsername(e.target.value)}
      />

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

      <input
        type="password"
        required
        placeholder="Confirm password"
        icon="lock_clock"
        value={confirmPassword}
        className={inputStyle}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div>
        <input
          type="checkbox"
          id="condition"
          required
          name="condition"
          value={agree}
          onChange={(e) => setAgree(e.target.value)}
        />
        <label htmlFor="condition"> I Agree to the Terms and Condition</label>
      </div>

      <Button loading={loading} text="Sign Up" />

      {error && <p className="error">{error}</p>}

      <div className="md:text-2xl font-bold">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-700">
          Login
        </Link>{" "}
        instead.
      </div>
    </form>
  );
}
