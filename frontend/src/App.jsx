import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
//import LoginFormPage from './components/LoginFormModal'; 
import * as sessionActions from './store/session';
//import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded ? <Outlet /> : <h1>Loading...</h1>}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      // {
      //   path: '/login',
      //   element: <LoginFormPage />
      // }, //removed for phase 4
      // {
      //   path: "/signup",
      //   element: <SignupFormPage />
      // } //removed for phase 4
    ]
  }
]);

function App() {
  console.log("App is rendering");
  return <RouterProvider router={router} />;
}

export default App;
