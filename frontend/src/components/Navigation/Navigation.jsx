// import { NavLink } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import ProfileButton from './ProfileButton';
// import * as sessionActions from '../../store/session';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../SignupFormModal';
// import './Navigation.css';

// function Navigation({ isLoaded }) {
//   const sessionUser = useSelector(state => state.session.user);
//   const dispatch = useDispatch();

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logout());
//   };

//   const sessionLinks = sessionUser ? (
//     <>
//       <li>
//         <ProfileButton user={sessionUser} />
//       </li>
//       <li>
//         <button onClick={logout}>Log Out</button>
//       </li>
//     </>
//   ) : (
//     <>
//       <li>
//         <OpenModalButton
//           buttonText="Log In"
//           modalComponent={<LoginFormModal />}
//           />
//       </li>
//       <li>
//         <OpenModalButton
//           buttonText="Sign Up"
//           modalComponent={<SignupFormModal />}
//         />
//       </li>
//     </>
//   );

//   return (
//     <ul>
//       <li>
//         <NavLink to="/">Home</NavLink>
//       </li>
//       {isLoaded && sessionLinks}
//     </ul>
//   );
// }

// export default Navigation;


//Phase 5
import { NavLink } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import janbIcon from '../../assets/Images/janbIcon.png';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
     /* <li>
        <NavLink to="/">Home</NavLink>
      </li> removed after authenticate*/
  <nav className="navigation-container">
    <NavLink to="/" className="logo-link">
    <div className="app-logo-name">
    <img src={janbIcon} alt="App Logo" className="app-logo" /> 
    <span className="app-name">JANB</span>
    </div>
    </NavLink>
    <ul className="navigation-list">
      {isLoaded && (
        <li className="navigation-item">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    </nav>
  );
}

export default Navigation;