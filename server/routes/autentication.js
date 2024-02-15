const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')


const AutenticationController=require('../controllers/AutenticationControllers')

router.get('/ConfirmResetPassword/:id',AutenticationController.resetPassword)

router.post('/resetPassword',AutenticationController.resetthePassword)
router.post('/forgotPassword',AutenticationController.forgotPassword)

router.post("/login",AutenticationController.GetLoginDetails)

router.post("/signUp",AutenticationController.GetSignupDetails)


router.get("/logout",AutenticationController.logOut)




module.exports=router