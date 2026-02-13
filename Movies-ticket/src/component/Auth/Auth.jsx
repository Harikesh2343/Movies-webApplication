import React from 'react';
import AuthForm from './AuthForm';
import { useDispatch } from "react-redux";
import { sendUserAuthRequest } from '../../api-helpers/api-helpers';
import { userActions } from '../../store';

const Auth = () => {
  const dispatch = useDispatch();
  
  const onResReceived = (data) => {
    if (data) {
      console.log(data);
      dispatch(userActions.login());
      localStorage.setItem("userId", data.id);
    }
  };
  
  const getData = (data) => {
    console.log("Auth", data);
    sendUserAuthRequest(data.inputs, data.signup)
      .then(onResReceived)
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} />
    </div>
  );
};

export default Auth;