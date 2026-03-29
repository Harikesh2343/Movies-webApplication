import React from 'react';
import AuthForm from '../Auth/AuthForm';
import { sendAdminAuthRequest } from '../../api-helpers/api-helpers';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminActions } from '../../store';

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onResReceived = (data) => {
    if (data) {
      console.log(data);
      dispatch(adminActions.login());
      localStorage.setItem("adminId", data.id);
      localStorage.setItem("token", data.token);
      navigate("/");
    }
  };
  
  const getData = (data) => {
    console.log("Admin", data);
    sendAdminAuthRequest(data.inputs, data.signup)
      .then(onResReceived)
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={true} />
    </div>
  );
};

export default Admin;