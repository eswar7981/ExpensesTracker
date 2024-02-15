const express=require('express')
const leaderBoardController=require('../controllers/leaderboardControllers')
const router=express.Router()
const expenseController=require('../controllers/ExpensesController')
const { route } = require('./autentication')
router.get('/previousDownloadedFiles',expenseController.getAllDownloadedFiles)
router.get('/previousExpenses',expenseController.getExpenses)
router.get('/downloadExpenses',expenseController.downloadExpenses)
router.get('/getCurrentPageData',expenseController.sendCurrentPageData)
router.get('/leaderBoard',leaderBoardController.showLeaderBoard)
router.post('/addExpense',expenseController.AddExpense)
router.get('/addExpense',expenseController.getExpenses)
router.get('/addExpense/deleteExpense',expenseController.deleteExpenses)
router.get('/addExpense/payment',expenseController.handlePayment)
router.get('/addExpense/updatePaymentStatus',expenseController.updateStatus)


module.exports=router