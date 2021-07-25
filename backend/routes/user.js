const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const check_auth = require("../middleware/check_auth");


router.post("/api/v1/auth/signup", UserController.signUp);
router.post("/api/v1/auth/login", UserController.login);
router.post("/api/v1/auth/add_wallet_balance",check_auth,UserController.add_wallet_balance);
router.get("/api/v1/auth/portfolio",check_auth,UserController.portfolio);
router.get("/api/v1/auth/get_live_stocks_rates",check_auth,UserController.get_live_stocks_rates);
router.get("/api/v1/auth/subscribe_to_get_live_stock_rates",check_auth,UserController.subscribe_to_get_live_stock_rates);


module.exports = router;
