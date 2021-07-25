#  Stock Market Tracking System Backend 
##  Implemented using node js, express and mongo db 
##  To get live data of IEX cloud API is used

### Rest API Endpoints

### Registeration
### http://localhost:4000/user/api/v1/auth/signup
### This endpoint will register the user in the system using email, password
### The password is hashed before storing in database

### Login
### http://localhost:4000/user/api/v1/auth/login
### This endpoint will log the user into the system and return the jwt auth token to used by the other API's


## Below Enpoints require auth token
### Sell Stock
### http://localhost:4000/stock_market/api/v1/stocks/sell_stock
### This endpoint will update the quantity of the stock if sold by the user.

### Buy Stock
### http://localhost:4000/stock_market/api/v1/stocks/buy_stock
### This endpoint will update the quantity of the stock if purchased by the user.

### Add Amount to Wallet
### http://localhost:4000/user/api/v1/auth/add_wallet_balance

### Subscribe to get live rates
### http://localhost:4000/user/api/v1/auth/subscribe_to_get_live_stock_rates

### Get live stock data 
### http://localhost:4000/user/api/v1/auth/get_live_stocks_rates

## Setup 
### 1) After cloning the repo run the "npm install" to install the dependcies
### 2) Create a database called "stock_market_db" on local mongo db instance and admin with user name "neel" and password "admin"
