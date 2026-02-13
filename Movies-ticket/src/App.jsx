import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./component/Header";
import Admin from "./component/Admin/Admin";
import Movies from "./component/Movies/Movies";
import HomePage from "./component/HomePage";
import Auth from "./component/Auth/Auth";
import Booking from "./component/Bookings/Booking";
import UserProfile from "./profile/UserProfile";
import AdminProfile from "./profile/AdminProfile";
import AddMovie from "./component/Movies/AddMovie";
import { adminActions, userActions } from "./store";

function App() {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispatch(userActions.login());
    } else if (localStorage.getItem("adminId")) {
      dispatch(adminActions.login());
    }
  }, [dispatch]);

  return (
    <div>
      <Header />
      <section>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/admin" element={isAdminLoggedIn ? <AdminProfile /> : <Admin />} /> 
          <Route path="/auth" element={<Auth />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/add" element={<AddMovie />} />
          <Route path="/booking/:id" element={<Booking />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;