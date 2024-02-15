import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./AddExpense.css";
const AddExpense = () => {
  const premium = useSelector((state) => state.auth.premium);
  const [expenses, setExpenses] = useState();
  const [addItem, setAddItem] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const login = useSelector((state) => state.auth.login);
  const [expenseDetails, setExpenseDetails] = useState({
    amount: '',
    description: "",
    category: "",
    token: token,
  });

  const moneySpentHandler = (e) => {
    setExpenseDetails({ ...expenseDetails, ["amount"]: e.target.value });
  };

  const categoryHandler = (e) => {
    setExpenseDetails({ ...expenseDetails, ["category"]: e.target.value });
  };

  const descriptionHandler = (e) => {
    setExpenseDetails({ ...expenseDetails, ["description"]: e.target.value });
  };

  useEffect(() => {
    fetch("http://localhost:5000/expenses/addExpense", {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const expense=data.reverse()
        const latest10=expense.slice(0,10)
        setExpenses(latest10);
        
      });
  }, [addItem]);

  async function submitHandler(e) {
    e.preventDefault();
    setExpenseDetails({ ...expenseDetails, ["token"]: token });
    console.log(expenseDetails);
    fetch("http://localhost:5000/expenses/addExpense", {
      method: "POST",
      body: JSON.stringify(expenseDetails),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json()
      }).then((expens)=>{
       
        setExpenses(expens)
        setAddItem(!addItem)
      })
      .catch((err) => {
        console.log(err);
      });

    setExpenseDetails({
      amount:'',
      description: "",
      category: "",
      token: token,
    });
  }

  const deleteHandler = (e, item) => {
    console.log(item.moneySpent)
    e.preventDefault();
    console.log("delete", item);
    fetch("http://localhost:5000/expenses/addExpense/deleteExpense", {
      method: "GET",
      headers: {
        id: item.id,
        user: item.UserId,
        amount:item.moneySpent
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const expense=data.reverse()
        const latest10=expense.slice(0,10)
        setExpenses(latest10);
      });
  };

  return (
    <>
      {premium ? (
        <>
          <div style={{ display: "grid", justifyContent: "center" }}>
            <form onSubmit={submitHandler}>
              <div
                className="title"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <h3>Add Expense</h3>
              </div>
              <div className="formBoundary" style={{ backgroundColor: "gold"}}>
                <div style={{display:"flex",justifyContent:'center',fontFamily:'sans-serif',paddingBottom:'10px'}}>Premium User</div>
                <div className="form">
                  <div className="labels">
                    <label>Money Spent: </label>
                    <label>description: </label>
                    <label>Category: </label>
                  </div>
                  <div className="inputs">
                    <input
                      required
                      type="number"
                      name="amount"
                      onChange={moneySpentHandler}
                      value={expenseDetails.amount}
                    />
                    <input
                      required
                      type="text"
                      name="description"
                      onChange={descriptionHandler}
                      value={expenseDetails.description}
                    />

                    <select
                      name="category"
                      value={expenseDetails.category}
                      onChange={categoryHandler}
                    >
                      <option value=""></option>
                      <option value="Food">Food</option>
                      <option value="ElectricityBill">Electricity Bill</option>
                      <option value="Vehicle Fuel">Vehicle Fuel</option>
                      <option value="House Rent">House Rent</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Daily Expenses">Daily expenses</option>
                      <option value="Travelling Expenses">
                        Travelling Expenses
                      </option>
                      <option value="Loan">Loan</option>
                      <option value="EMI">EMI</option>
                    </select>
                  </div>
                </div>
                <div className="button">
                  <button type="submit">Add</button>
                </div>
              </div>
            </form>
          </div>
          <div style={{display:"flex",justifyContent:'center'}}>
            <h4>Recent Expenses</h4>
          </div>
          <div className="outerexpenses">
            {expenses &&
              expenses.map((item) => (
                <div className="expenses">
                  <p>{item.id}</p>
                  <p>{item.moneySpent}</p>
                  <p>{item.description}</p>
                  <p>{item.category}</p>

                  <button
                    className="delete"
                    onClick={(e) => {
                      deleteHandler(e, item);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <div className="previous" style={{display:'flex',justifyContent:'center'}}>
          <NavLink to="/expenses/previousExp">
              <button className="modeChange">Previous Expenses</button>
            </NavLink>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "grid", justifyContent: "center" }}>
            <form onSubmit={submitHandler}>
              <div
                className="title"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <h3>Add Expense</h3>
              </div>
              <div className="formBoundary">
                <div className="form">
                  <div className="labels">
                    <label>Money Spent: </label>
                    <label>description: </label>
                    <label>Category: </label>
                  </div>
                  <div className="inputs">
                    <input
                      required
                      type="number"
                      name="amount"
                      onChange={moneySpentHandler}
                      value={expenseDetails.amount}
                    />
                    <input
                      required
                      type="text"
                      name="description"
                      onChange={descriptionHandler}
                      value={expenseDetails.description}
                    />

                    <select
                      name="category"
                      value={expenseDetails.category}
                      onChange={categoryHandler}
                    >
                      <option value=""></option>
                      <option value="Food">Food</option>
                      <option value="ElectricityBill">Electricity Bill</option>
                      <option value="Vehicle Fuel">Vehicle Fuel</option>
                      <option value="House Rent">House Rent</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Daily Expenses">Daily expenses</option>
                      <option value="Travelling Expenses">
                        Travelling Expenses
                      </option>
                      <option value="Loan">Loan</option>
                      <option value="EMI">EMI</option>
                    </select>
                  </div>
                </div>
                <div className="button">
                  <button type="submit">Add</button>
                </div>
              </div>
            </form>
          </div>
          <div style={{display:"flex",justifyContent:'center'}}>
            <h4>Recent Expenses</h4>
          </div>
          <div className="outerexpenses">
            {expenses &&
              expenses.map((item) => (
                <div className="expenses">
               
                  <p>{item.moneySpent}</p>
                  <p>{item.description}</p>
                  <p>{item.category}</p>

                  <button
                    className="delete"
                    onClick={(e) => {
                      deleteHandler(e, item);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
          <NavLink to="/expenses/previousExp">
              <button className="modeChange">Previous Expenses</button>
            </NavLink>
          </div>
        </>
      )}
    </>
  );
};

export default AddExpense;
