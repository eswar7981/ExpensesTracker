import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = (e) => {
    const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/autentication/forgotPassword", {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
       
        return res.json();
       
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
alert('A mail is sent to change your password')
      navigate('/autentication/login')
      setEmail('')
  };

  return (
    <>
      <div style={{ display: "grid", justifyContent: "center" }}>
        <form onSubmit={submitHandler}>
          <div
            className="title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h3>Forgot Password</h3>
          </div>
          <div className="formBoundary">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "sans-serif",
                paddingBottom: "10px",
              }}
            ></div>
            <div className="form">
              <div className="labels">
                <label>Email: </label>
              </div>
              <div className="inputs">
                <input
                  required
                  type="email"
                  name="email"
                  onChange={emailHandler}
                  value={email}
                />
              </div>
            </div>
            <div className="button">
              <button type="submit">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
