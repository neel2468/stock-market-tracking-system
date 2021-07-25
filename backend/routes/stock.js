const express = require("express");
const router = express.Router();

const StockController = require('../controllers/stock');
const check_auth = require("../middleware/check_auth");


router.post("/api/v1/stocks/buy_stock", check_auth,StockController.buy_stock);
router.post("/api/v1/stocks/sell_stock", check_auth,StockController.sell_stock);



module.exports = router;
