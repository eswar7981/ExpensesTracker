import React, { useEffect, useState } from "react";
import "./Login.css";
import { NavLink, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthStore";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const premium=useSelector((state)=>state.auth.premium)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [showPassword,setShowPassword]=useState(false)
  const [login, setLogin] = useState(false);

  const emailHandler = (e) => {
    setLoginDetails({ ...loginDetails, ["email"]: e.target.value });
  };

  const passwordHandler = (e) => {
    setLoginDetails({ ...loginDetails, ["password"]: e.target.value });
  };

  async function submitHandler(e) {
    e.preventDefault();

    fetch("http://localhost:5000/autentication/login", {
      method: "POST",
      body: JSON.stringify(loginDetails),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        
        if (result.login !== "user not found" && result.login !== "failed") {
          dispatch(authActions.setToken(result.token));
          dispatch(authActions.setLogin());
          if (result.premium === true) {
            
            dispatch(authActions.setPremium());
         
          }
          alert("login is successful");
          navigate("/expenses/addExpense");
        }
        if (result.login === "failed") {
          alert("wrong password");
        } 
        if(result.login==="user not found"){
          alert('User not found')
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLogin(true);

    setLoginDetails({ email: "", password: "" });
  }

  return (
    <div style={{ display: "grid", justifyContent: "center" }}>
      <form onSubmit={submitHandler}>
        <div
          className="title"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h3>Login</h3>
        </div>
        <div className="formBoundary">
          <div className="form">
            <div className="labels">
              <label>Email Adress: </label>
              <label>Password: </label>
            </div>
            <div className="inputs">
              <input style={{width:'160px'}}
                required
                type="text"
                name="emailAdress"
                onChange={emailHandler}
                value={loginDetails.email}
              />
              <div>
              <input 
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={passwordHandler}
                value={loginDetails.password}
              />
              <button className="showPassword" onClick={(e)=>{
                e.preventDefault()
                setShowPassword(!showPassword)
              }} style={{background:'None',border:'None'}}>{showPassword ?<p > 
              🙉</p>:<p>🙈</p>}</button>
              </div>
             
            </div>
          </div>
          <div className="button">
            <button type="submit">login</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NavLink to="/autentication/forgotPassword">
              <button className="modeChange">Forgot Password</button>
            </NavLink>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NavLink to="/autentication/signUp">
              <button className="modeChange" style={{ marginTop: "5px" }}>
                Does not Have an Account? SignUp
              </button>
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
