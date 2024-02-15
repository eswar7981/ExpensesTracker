import React from "react";
import { useState } from "react";
import "./SignUp.css";
import { NavLink, json, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword,setShowPassword]=useState(false)
  const [SignUpDetails, setSignUpDetails] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const nameHandler = (e) => {
    setSignUpDetails({ ...SignUpDetails, ["userName"]: e.target.value });
  };

  const emailHandler = (e) => {
    setSignUpDetails({ ...SignUpDetails, ["email"]: e.target.value });
  };

  const passwordHandler = (e) => {
    setSignUpDetails({ ...SignUpDetails, ["password"]: e.target.value });
  };

  const confirmPasswordHandler = (e) => {
    setSignUpDetails({ ...SignUpDetails, ["confirmPassword"]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (SignUpDetails.password.length < 8) {
      alert("password should contain atleast 8 characters");
    }
    if (SignUpDetails.password == SignUpDetails.confirmPassword) {
      fetch("http://localhost:5000/autentication/signUp", {
        method: "POST",
        body: JSON.stringify(SignUpDetails),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message === "email is already taken") {
            alert("email is already taken");
          }
          if (data.message === "signup successful") {
            alert("Sign up successful");
            navigate("/autentication/login");
          }
        });
      setSignUpDetails({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } else {
      alert("password is not matching");
      setSignUpDetails({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <form onSubmit={submitHandler}>
          <div
            className="title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h3>Sign Up</h3>
          </div>
          <div className="formBoundary">
            <div className="form">
              <div className="labels">
                <label>User Name:</label>
                <label style={{marginTop:'10px'}}>Email Adress: </label>
                <label style={{marginTop:'10px'}}>Password:</label>
                <label style={{marginTop:'5px'}}>Confirm Password: </label>
              </div>
              <div className="inputs">
                <input style={{width:'160px'}}
                  required
                  type="text"
                  name="userName"
                  onChange={nameHandler}
                  value={SignUpDetails.userName}
                />
                <input 
                style={{marginTop:'10px',width:'160px'}}
                  required
                  type="email"
                  name="emailAdress"
                  onChange={emailHandler}
                  value={SignUpDetails.email}
                />
                <div>
                <input style={{width:'160px'}}
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={passwordHandler}
                  value={SignUpDetails.password}

                />
                 <button className="showPassword" onClick={(e)=>{
                e.preventDefault()
                setShowPassword(!showPassword)
              }} style={{background:'None',border:'None'}}>{showPassword ?<p > 
              🙉</p>:<p>🙈</p>}</button>
                </div>
               
                <input style={{width:'160px'}}
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="confirmpassword"
                  onChange={confirmPasswordHandler}
                  value={SignUpDetails.confirmPassword}
                />
              </div>
            </div>
            <div className="button">
              <button type="submit">Sign Up</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <NavLink to="/autentication/login">
                <button className="modeChange">Account Exists! Login</button>
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
