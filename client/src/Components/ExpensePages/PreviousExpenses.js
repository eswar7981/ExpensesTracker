import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./PreviousExpenses.css";
import { useFetcher } from "react-router-dom";
const PreviousExpenses = () => {
  const [newDownload, setNewDownload] = useState(false);

  const isUserPremium = useSelector((state) => state.auth.premium);
  const [dayExpenses, setDayExpenses] = useState();
  const [monthlyExpenses, setMonthlyExpenses] = useState();
  const [yearlyExpenses, setYearlyExpenses] = useState();
  const [prevDownloadFiles, setPrevDownloadFiles] = useState();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetch("http://localhost:5000/expenses/previousDownloadedFiles", {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((file) => {
      const files=file.files.reverse().slice(0,10)
        setPrevDownloadFiles(files);
       
      });
  }, [newDownload]);

  useEffect(() => {
    fetch("http://localhost:5000/expenses/previousExpenses", {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((expens) => {
      
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        const dayExp = expens.filter(
          (expense) => expense.updatedAt.slice(8, 10) == day
        );
        const monthlyExp = expens.filter(
          (expense) => expense.updatedAt.slice(5, 7) == month
        );
        const yearlyExp = expens.filter(
          (expense) => expense.updatedAt.slice(0, 4) == year
        );
        setDayExpenses(dayExp);
        setMonthlyExpenses(monthlyExp);
        setYearlyExpenses(yearlyExp);
      });
  }, []);

  const downloadHandler = (e) => {
    e.preventDefault();
    if (!isUserPremium) {
      alert("Buy Premium to get this feature");
    } else {
      fetch("http://localhost:5000/expenses/downloadExpenses", {
        method: "GET",
        headers: {
          token: token,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((expensesfile) => {
          if (expensesfile.upload == "success") {
            var a = document.createElement("a");
            a.href = expensesfile.file;
            a.download = "MyExpenses.txt";
            a.click();
            setNewDownload(!newDownload);
            alert("file is downloaded");
          } else {
            alert("failed to download the file");
          }
        });
    }
  };

  const prevDownloadHandler = (e, file) => {
    e.preventDefault();
    var a = document.createElement("a");
    a.href = file.file;
    a.download = "MyExpenses.txt";
    a.click();
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3>Daily Expenses</h3>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table style={{ border: "solid" }}>
          <thead>
            <tr style={{ border: "solid" }}>
              <th>Sl No</th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Expenses</th>
            </tr>
          </thead>
          <tbody>
            {dayExpenses &&
              dayExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{expense.updatedAt.slice(0, 10)}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>{expense.moneySpent}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3>Monthly Expenses</h3>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table style={{ border: "solid" }}>
          <thead>
            <tr style={{ border: "solid" }}>
              <th>Sl No</th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Expenses</th>
            </tr>
          </thead>
          <tbody>
            {monthlyExpenses &&
              monthlyExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{expense.updatedAt.slice(0, 10)}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>{expense.moneySpent}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3>Yearly Expenses</h3>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <table style={{ border: "solid" }}>
          <thead>
            <tr style={{ border: "solid" }}>
              <th>Sl No</th>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Expenses</th>
            </tr>
          </thead>
          <tbody>
            {yearlyExpenses &&
              yearlyExpenses.map((expense, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{expense.updatedAt.slice(0, 10)}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>{expense.moneySpent}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="download">
        <button onClick={downloadHandler}>Download Expenses</button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3 style={{ color: "black" }}>Recent Downloads</h3>
      </div>
      <div style={{ display: "flex", marginLeft: "20vw" }}>
        <h4>Download On</h4>
      </div>
      {prevDownloadFiles &&
        prevDownloadFiles.map((file) => (
          <>
            <div className="prevDownload">
              <p>{file.createdAt.slice(0, 10)}</p>
              <div className="downloadAgain">
                <button onClick={(e)=>prevDownloadHandler(e,file)}>Download</button>
              </div>
            </div>
          </>
        ))}
    </>
  );
};

export default PreviousExpenses;
