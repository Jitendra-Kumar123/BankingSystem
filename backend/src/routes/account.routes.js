const express = require('express');
const accountController = require("../controllers/account.controller.js");
const authMiddleware = require('../middlewares/auth.middleware.js');


const router = express.Router();


router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);

router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController);

router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController);

module.exports = router;