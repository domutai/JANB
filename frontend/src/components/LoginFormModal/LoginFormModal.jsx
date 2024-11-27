// import { useState } from 'react';
// import * as sessionActions from '../../store/session';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
// import { useModal } from '../../context/Modal';
// import './LoginFormModal.css';


// function LoginFormPage() {
//     console.log("LoginFormModal is rendering");
//   const dispatch = useDispatch();
//   const sessionUser = useSelector((state) => state.session.user);
//   const [credential, setCredential] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});

//   if (sessionUser) return <Navigate to="/" replace={true} />;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrors({});
//     return dispatch(sessionActions.login({ credential, password })).catch(
//       async (res) => {
//         const data = await res.json();
//         if (data?.errors) setErrors(data.errors);
//       }
//     );
//   };

//   return (
//     <>
//       <h1>Log In</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username or Email
//           <input
//             type="text"
//             value={credential}
//             onChange={(e) => setCredential(e.target.value)}
//             required
//           />
//         </label>
//         <label>
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>
//         {errors.credential && <p>{errors.credential}</p>}
//         <button type="submit">Log In</button>
//       </form>
//     </>
//   );
// }

// export default LoginFormPage;

//Phase 4
import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const { closeModal } = useModal();

// Effect to enable button when form is valid
useEffect(() => {
  if (credential.length >= 4 && password.length >= 6) {
    setIsDisabled(false); // Enable button if both fields are filled
  } else {
    setIsDisabled(true); // Disable button if any field is empty
  }
}, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
    .then(() => {
      closeModal();
      window.location = '/'; // Redirect to homepage
    })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = () => {
    dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
    .then(() => {
      closeModal();
      window.location = '/'; // Redirect to homepage
    })
      .catch((err) => console.error('Demo login failed', err));
  };

  return (
    <>
      <h1>Log In</h1>
      {/* Display error message at the top */}
      {Object.keys(errors).length > 0 && (
        <p className="error-message">{errors.credential || errors.password || 'Invalid credentials'}</p>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
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
        <button type="submit" disabled={isDisabled}>Log In</button>
      </form>
      <button className="demo-user-btn" onClick={handleDemoLogin}>
        Demo User
      </button>
    </>
  );
}


export default LoginFormModal;