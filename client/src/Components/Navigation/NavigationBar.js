import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthStore";
import useRazorpay from "react-razorpay";

const NavigationBar = () => {
  const premium = useSelector((state) => state.auth.premium);
  const [Razorpay] = useRazorpay();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const login = useSelector((state) => state.auth.login);

  const paymentHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/expenses/addExpense/payment", {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((response) => {
        console.log("hii");
        console.log(response);
        var options = {
          key: response.key_id,
          order_id: response.order.id,
          handler: function (response) {
            fetch(
              "http://localhost:5000/expenses/addExpense/updatePaymentStatus",

              {
                headers: {
                  token: token,
                  order_id: options.order_id,
                  payment_id: response.razorpay_payment_id,
                },
              }
            )
              .then((respo) => {
                return respo.json();
              })
              .then((res) => {
                console.log(res);
                dispatch(authActions.setPremium());

                alert("You are a Premium User from Now");
              });
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
        e.preventDefault();
        rzp.on("payment.failed", function (response) {
          console.log(response);
          rzp.close();
          alert("something went wrong");
        });
      });
  };

  return (
    <>
      <nav>
        {!login && (
          <ul style={{ listStyleType: "None" }}>
            <div className="navigation">
              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="autentication/login"
                >
                  <div className="btn">Login</div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="autentication/signUp"
                >
                  <div className="btn">Sign Up</div>
                </NavLink>
              </li>
            </div>
          </ul>
        )}

        {login && (
          <ul style={{ listStyleType: "None" }}>
            <div className="navigation">
              {!premium && (
                <li>
                  <div className="Premium">
                    {" "}
                    <button onClick={paymentHandler} className="prem">
                      Premium
                    </button>
                  </div>
                </li>
              )}

              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="expenses/previousExpenses"
                >
                  <div className="btn">Expenses Report</div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="expenses/addExpense"
                >
                  <div className="btn">AddExpense</div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="expenses/leaderBoard"
                >
                  <div className="btn">LeaderBoard</div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={{ textDecoration: "None" }}
                  to="autentication/logout"
                >
                  <div className="btn">LogOut</div>
                </NavLink>
              </li>
            </div>
          </ul>
        )}
      </nav>
    </>
  );
};

export default NavigationBar;
