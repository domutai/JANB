import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
//import LoginFormPage from './components/LoginFormModal'; 
import * as sessionActions from './store/session';
//import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation';
import SpotGrid from './components/SpotGrid';
import SpotDetails from './components/SpotDetails';
import CreateNewSpot from './components/CreateNewSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpot from './components/UpdateSpot';
import ManageReviews from './components/ManageReviews/ManageReviews';



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
        element: <SpotGrid />
        //element: <h1>Welcome!</h1> //removed after authenicate me frontend
      },
      {
        path: '/spots',
        element: <CreateNewSpot />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: '/reviews/current',
        element: <ManageReviews />,
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
  //console.log("App is rendering"); //Deploymet Phase said no Console Logs
  return <RouterProvider router={router} />;
}

export default App;
