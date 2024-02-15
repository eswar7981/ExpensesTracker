import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
const PasswordReset = () => {
    const [newPassword,setNewPassword]=useState('')
    const {id}=useParams()
    const navigate=useNavigate()
    
   



    const submitHandler=async(e)=>{
        e.preventDefault()


        const checkTheStatus=await fetch(`http://localhost:5000/autentication/confirmResetPassword/${id}`,{
            method:"GET",
        })

        const userId=await checkTheStatus.json()
   
        const initiateTheReset=await fetch('http://localhost:5000/autentication/resetPassword',{
            method:'POST',
            body:JSON.stringify({
                password:newPassword,
                id:userId.id,
                uuid:id
            }),
            headers:{
                'Content-Type':'application/json'
            }
        }).then((res)=>{
            return res.json()
        }).then((result)=>{
         
            if(result==='successful'){
                alert('password is changed successfully')
            }
            navigate('/autentication/login')
        })

        setNewPassword('')
    }


    const passwordHandler=(e)=>{
        setNewPassword(e.target.value)
    }

  return (
    <div style={{ display: "grid", justifyContent: "center" }}>
      <form onSubmit={submitHandler}>
        <div
          className="title"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h3>Reset Your Password</h3>
        </div>
        <div className="formBoundary">
          <div className="form">
            <div className="labels">
           
              <label>New Password: </label>
            </div>
            <div className="inputs">
            
              <input
                required
                type="password"
                name="password"
                onChange={passwordHandler}
                value={newPassword}
              />
            </div>
          </div>
          <div className="button">
            <button type="submit">Change</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PasswordReset
