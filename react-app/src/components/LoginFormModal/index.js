import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };
  const demoUser = () => {
    return dispatch(login("demo@aa.io", "password"));
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-brand">
        <i class="fa-brands fa-strava"></i>Clarity
      </div>
      <div className="auth-form-title">
        <div>Log In</div>
      </div>
      <form onSubmit={handleSubmit} className="auth-form-input-wrapper">
        {/* {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))} */}
        <div className="auth-form-error">
          {errors.length > 0 ? "The provided credentials were invalid." : ""}
        </div>

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="name@email.com"
          className="auth-form-input"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="password"
          className="auth-form-input"
        />

        <button type="submit" className="auth-form-button">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
