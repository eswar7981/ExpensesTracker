import React from 'react'
import { NavLink, useNavigate} from 'react-router-dom'
import './Logout.css'
import { useDispatch } from 'react-redux'
import { authActions } from '../Store/AuthStore'



const Logout = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  async function submitHandler(e){
    e.preventDefault()
  
    const res=await fetch('http://localhost:5000/autentication/logout')
    dispatch(authActions.setLogin())
    navigate('/autentication/login')
  }

  return (
    <div style={{ display: "grid", justifyContent: "center" }}>
    <form onSubmit={submitHandler}>
      <div
        className="title"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <h3>LogOut</h3>
      </div>
      <div className="formBoundary">
        <div className="form">
          <div className="labels">
            <label>Are you Sure</label>
          </div>
        </div>
        <div className="logoutbutton">
          <button type="submit">LogOut</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>

        </div>
      </div>
    </form>
  </div>
  )
}

export default Logout
