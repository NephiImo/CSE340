/* **********************************
* Account routes
* Unit 4, deliver login view activity                                      
* ********************************* */
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* **********************************
* Deliver login view
* Unit 4, deliver login view activity                                      
* ********************************* */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* **********************************
* Deliver Registeration View
* Unit 4, deliver registration view activity                                      
* ********************************* */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* **********************************
* Post Registeration
* Unit 4, Process registration activity                                      
* ********************************* */
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router;