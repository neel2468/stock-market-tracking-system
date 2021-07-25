const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Stock = require('../models/stock');

exports.buy_stock = (req,res,next) => {
    // Getting user id from the auth token
    // Here 'demo' is jwt secret
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "demo");
    //Finding stock by name and user id
    Stock.find({name: req.body.name, user_id: decoded.userId})
    .exec()
    .then(stock => {
        // If stock exists then update the quantity
        if (stock.length >= 1) {
            let quantity = stock[0].stock_quantity + req.body.stock_quantity;
            Stock.updateMany({name: req.body.name, user_id: decoded.userId},{$set: {"stock_quantity": quantity }})
            .exec().then(result => {
                console.log(result);
                    res.status(201).json({
                        message: "Stock purchased successfully"
                    })
            })
        }
        // else create Stock record related to that user in database 
        else {
            const stock = new Stock({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                symbol: req.body.symbol,
                current_price: req.body.price,
                stock_quantity: req.body.stock_quantity,
                user_id: decoded.userId
            })
            stock.save().then(
                result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Stock purchased successfully"
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    }); 
                });
        }
        
    })
}

exports.sell_stock = (req,res,next) => {
    // Getting user id from the auth token
    // Here 'demo' is jwt secret
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "demo");
      // If stock exists then update the quantity
    Stock.find({name: req.body.name,user_id: decoded.userId})
    .exec()
    .then(stock => {
        if (stock.length >= 1) {
            if(stock[0].stock_quantity < req.body.stock_quantity) {
                res.status(201).json({
                    message: "You cannot sold more stocks than you already have!"
                })
            
            } else {
                let quantity =  stock[0].stock_quantity - req.body.stock_quantity;
                Stock.updateMany({name: req.body.name, user_id: decoded.userId},{$set: {"stock_quantity": quantity }})
                .exec().then(result => {
                    console.log(result);
                        res.status(201).json({
                            message: "Stock sold successfully"
                        })
                })
            }
          // else create Stock record related to that user in database 
        } else {
            
            const stock = new Stock({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                symbol: req.body.symbol,
                current_price: req.body.price,
                stock_quantity: req.body.stock_quantity,
                user_id: decoded.userId
            })
            stock.save().then(
                result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Stock sold successfully"
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    }); 
                });
        }
    })
}
