import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const PreviousExp = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expenses, setExpenses] = useState();
  const [beforePage, setBeforePage] = useState(true);
  const [afterPage, setAfterPage] = useState(true);
  const [currPage, setCurrPage] = useState(1);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetch("http://localhost:5000/expenses/getCurrentPageData", {
      method: "GET",
      headers: {
        token: token,
        page: 0,
        rows: rowsPerPage,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(currPage)
        console.log(data.expenses);
        setExpenses(data.expenses);
      });
  }, [rowsPerPage]);

  const rowsPageHandler = (e) => {
    console.log(e.target.value);
    setRowsPerPage(e.target.value);
  };

  const nextPageHandler = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/expenses/getCurrentPageData", {
      method: "GET",
      headers: {
        token: token,
        page: currPage,
        rows: rowsPerPage,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(currPage)
        console.log('after page')
        console.log(data.beforePage,data.nextPage)
        setCurrPage(currPage + 1);
        setBeforePage(data.beforePage);
        setAfterPage(data.nextPage);
        setExpenses(data.expenses);
      });
  };

  const previousPageHandler = (e) => {
    setCurrPage(currPage - 1)
    e.preventDefault();
    fetch("http://localhost:5000/expenses/getCurrentPageData", {
      method: "GET",
      headers: {
        token: token,
        page: currPage,
        rows: rowsPerPage,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(currPage)
        if(currPage>1){
          console.log('before page')
          console.log(data.beforePage,data.nextPage)
          setExpenses(data.expenses);
        }else{
          alert('there is no previous page')
        }
    
      });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: "100px" }}>
        {beforePage && (
          <div
            className="previous"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button style={{ color: "white" }} onClick={previousPageHandler}>
              ←Before Page
            </button>
          </div>
        )}
        {
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <select
                style={{
                  width: "40px",
                  height: "25px",
                  backgroundColor: "#F5CA20",
                }}
                name="category"
                value={rowsPerPage}
                onChange={rowsPageHandler}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
            </div>
          </div>
        }

        {afterPage && (
          <div
            className="previous"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button style={{ color: "white" }} onClick={nextPageHandler}>
              Next Page→
            </button>
          </div>
        )}
      </div>
      <div className="outerexpenses">
        {expenses &&
          expenses.map((item) => (
            <div className="expenses">
              <p>{item.id}</p>
              <p>{item.moneySpent}</p>
              <p>{item.description}</p>
              <p>{item.category}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default PreviousExp;
