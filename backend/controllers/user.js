const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;

const User = require('../models/user');
const Stock = require('../models/stock');

exports.signUp = (req,res,next) => {
    // Checking for email id before registration
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        // If email exists then return error "Email exists"
        if (user.length >= 1) {
            return res.status(409).json({
              message: "Email exists"
            });
        } else {
           // First encrypt the password and then create user record 
            bcrypt.hash(req.body.password,10,(err,hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        subscription_status: false,
                        wallet_balance: 0
                    });
                    user.save().then(
                        result => {
                            console.log(result);
                            res.status(201).json({
                               message: "registered successfully"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                              error: err
                            }); 
                        });
                    }
                });
        }
    });
};    

exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            // Creating token using authenticated user id and user email
            // Here "demo" is jwt secret for creating the auth token
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              "demo",
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

  exports.add_wallet_balance = (req,res,next) => {
    // Getting user id from the auth token in the header 
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "demo");
    User.find({_id:decoded.userId})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            let balance = user[0].wallet_balance + req.body.amount
            console.log(balance);
            User.updateMany({_id: decoded.userId},{$set: {"wallet_balance": balance}})
            .exec().then(result => {
              console.log(result);
              res.status(201).json({
                message: "Balance updated successfully!"
              })
            })
        }
    })
}

exports.portfolio = (req,res,next) => {
  // Getting user id from the auth token in the header 
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "demo");
  User.find({_id:decoded.userId})
  .exec()
  .then(user => {
    if(user.length >= 1) {
      Stock.find({user_id:decoded.userId}).exec().then(stocks => {
        res.status(200).json({
          user_profile: user,
          stocks: stocks
        })
      })
    }
  })
}

exports.get_live_stocks_rates = (req,res,next) => {
  // Getting user id from the auth token in the header 
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "demo");
  User.find({_id:decoded.userId}).exec().then(async(user) => {
    if(user.length >= 1) {
      if(user[0].subscription_status == false) {
        return res.status(200).json({
          message: "You must be subscribed to get live rates"
        })
      } else {
        //List of stocks
        let ticker_list = ['SAVA','LAC','TSLA','RIO','SIRI','MDB','NVAX','SBUx','SCHD','ALB','CRLBF']
        let result_list = []
        for(let x in ticker_list){
          const res =  await axios.get('https://cloud.iexapis.com/stable/stock/'+ticker_list[x]+'/quote?token=pk_edf9c45a75ee47508c5c15bbe63572e4')
          result_list.push(res.data);
        }
        return res.status(200).json({
          stock_data: result_list
        })
        
      }
    }
  });
}

exports.subscribe_to_get_live_stock_rates = (req,res,next) => {
  // Getting user id from the auth token in the header 
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "demo");
  User.find({_id:decoded.userId}).exec().then(user => {
    if(user.length >= 1) {
      User.updateMany({_id:decoded.userId},{$set: {'subscription_status': true}})
      .exec().then(result => {
        res.status(200).json({
          message: "Subscribed successfully"
        })
      })
    }
  })

}