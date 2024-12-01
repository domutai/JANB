import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isFormIncomplete =
    !email || !username || !firstName || !lastName || !password || !confirmPassword;

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Step 1: Local validation
      const validationErrors = {};
    
      if (!email.includes("@") || !email.includes(".")) {
        validationErrors.email = "Please provide a valid email address.";
      }
      if (username.length < 4) {
        validationErrors.username = "Username must be at least 4 characters long.";
      }
      if (/\S+@\S+\.\S+/.test(username)) {
        validationErrors.username = "Username cannot be an email.";
      }
      if (firstName.trim() === "") {
        validationErrors.firstName = "First name is required.";
      }
      if (lastName.trim() === "") {
        validationErrors.lastName = "Last name is required.";
      }
      if (password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters long.";
      }
      if (password !== confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match.";
      }
    
      // If local validation fails, set errors and stop
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    
      // Step 2: Backend validation
      try {
        await dispatch(
          sessionActions.signup({
            email,
            username,
            firstName,
            lastName,
            password,
          })
        );
        closeModal(); // Close modal on successful signup
        window.location = '/'; // Redirect to home page
      } catch (res) {
        const data = await res.json();
    
        const backendErrors = {};
    
        if (data?.errors) {
          // Map backend errors to corresponding keys
          if (data.errors.email) {
            backendErrors.email = data.errors.email;
          }
          if (data.errors.username) {
            backendErrors.username =
              data.errors.username.includes("already exists")
                ? "Username already exists. Please choose another."
                : data.errors.username;
          }
        }
    
        // Merge backend errors with existing errors
        setErrors((prevErrors) => ({
          ...prevErrors, // Preserve previous local errors
          ...backendErrors, // Add backend errors
        }));
      }
    };
    

  return (
    <>
      <h1>Sign Up</h1>
      {Object.keys(errors).length > 0 && (
        <div className="error-messages">
          {Object.values(errors).map((error, idx) => (
            <p key={idx} className="error">{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          disabled={isFormIncomplete}
          className={isFormIncomplete ? 'disabled' : ''}
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;