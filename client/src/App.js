import logo from "./logo.svg";
import "./App.css";
import { Route,Routes } from "react-router-dom";
import NavigationBar from "./Components/Navigation/NavigationBar";
import Login from "./Components/Autentication/Login";
import SignUp from "./Components/Autentication/SignUp";
import AddExpense from "./Components/ExpensePages/AddExpense";
import Logout from "./Components/Autentication/Logout";
import PreviousExp from "./Components/ExpensePages/PreviousExp";
import { useSelector } from "react-redux";
import LeaderBoard from "./Components/ExpensePages/LeaderBoard";
import ForgotPassword from "./Components/Autentication/ForgotPassword";
import PreviousExpenses from "./Components/ExpensePages/PreviousExpenses";
import { useEffect, useState } from "react";
import OpeningPage from "./Components/ExpensePages/OpeningPage";
import PasswordReset from "./Components/Autentication/PasswordReset";

function App() {
  const [openingPage,setOpeningPage]=useState(true)
 
  useEffect(()=>{
setTimeout(()=>{
setOpeningPage(false)
},3000)
  },[])
 
  
  return (
    <>
{openingPage ? <OpeningPage></OpeningPage>
:
<>
<header>
        <NavigationBar></NavigationBar>
      </header>
      <main>
        <Routes>
        <Route path="autentication/forgotPassword" element={<ForgotPassword/>}></Route> 
        <Route path="autentication/resetPassword/:id" element={<PasswordReset/>}></Route>
          <Route path="autentication/login" element={<Login/>}></Route>
          <Route path="autentication/signUp" element={<SignUp/>}></Route>
          <Route path="autentication/logout" element={<Logout/>}></Route>
          <Route path="expenses/addExpense" element={<AddExpense/>}></Route>
          <Route path="expenses/leaderBoard" element={<LeaderBoard/>}></Route>
          <Route path="expenses/previousExpenses" element={<PreviousExpenses/>}></Route>
          <Route path="expenses/previousExp" element={<PreviousExp/>}></Route>
         
         </Routes>
      </main>
 
</>
}
    
    
   
    </>
  );
}

export default App;
