import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";
import { login } from "../../store/session";
function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const newUser = {
        username: username,
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
      };
      console.log("newUser", newUser);

      const data = await dispatch(
        signUp(username, email, password, firstName, lastName)
      );
      if (data) {
        setErrors(data);
      } else {
        closeModal();
      }
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  const demoUser = () => {
    dispatch(login("demo@aa.io", "password"));
    closeModal();
    return;
  };
  return (
    <div className="auth-form-wrapper-signup">
      <div className="auth-form-brand">
        <i class="fa-brands fa-strava"></i>Clarity
      </div>
      <div className="auth-form-title">
        <div>Sign up</div>
      </div>
      <div className="auth-form-input-wrapper">
        <form onSubmit={handleSubmit} className="auth-form-input-wrapper">
          <div className="auth-form-error">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="auth-form-input"
            />
          </div>
          <div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
              className="auth-form-input"
            />
          </div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
            className="auth-form-input"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className="auth-form-input"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="auth-form-input"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
            className="auth-form-input"
          />

          <button type="submit" className="auth-form-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
