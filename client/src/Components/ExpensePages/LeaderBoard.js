import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../Store/AuthStore'

const LeaderBoard = () => {
   const [leaderBoardData,setLeaderBoardData]=useState()

    useEffect(()=>{
        fetch('http://localhost:5000/expenses/leaderBoard',{
        }).then((res)=>{
            return res.json()
        }).then((data)=>{
            const sortedData=data.sort((item1,item2)=>item2.totalExpenses-item1.totalExpenses)
            setLeaderBoardData(sortedData)
        })
    },[])



  return (
    <div  style={{display:'flex',justifyContent:'center'}}>
      <div className="outerexpenses">
            {leaderBoardData &&
              leaderBoardData.map((user,index) =>
               (
            
                <div  style={{display:'flex'}}>
                    {(index+1)===1? ( <p style={{marginTop:'30px',paddingRight:'20px',fontSize:'20px'}}>🥇</p>
                  ):( <p style={{marginTop:'30px',paddingRight:'20px',fontSize:'20px'}}> </p>

                  )}
                   {(index+1)===2? ( <p style={{marginTop:'30px',paddingRight:'20px',fontSize:'20px'}}>🥈</p>
                  ):( <p style={{marginTop:'30px',paddingRight:'20px',fontSize:'20px'}}> </p>

                  )}
                  {(index+1)===3? ( <p style={{marginTop:'30px',paddingRight:'20px',fontSize:'20px'}}>🥉</p>
                  ):( <p style={{marginTop:'30px',paddingRight:'20px',fontSize:'20px'}}> </p>

                  )}
                  
                     <li  className="expenses" style={{gap:'120px'}}>
                  
                        <p>{index+1}</p>
                  <p>{user.name}</p>
                  <p>{user.totalExpenses}</p>
                  </li>
                  
                </div>
                
              ))}
          </div>
    </div>
  )
}

export default LeaderBoard
