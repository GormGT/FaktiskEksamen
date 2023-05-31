const { User } = require("../models/Object");
const jwt = require('jsonwebtoken');
// const { find } = require('../models/Object');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;//assign the jwt token to the const

    //check json web token exists & is verified
    if(token){
        jwt.verify(token, "don't look", (err, decodedToken) => { //verify the json web token
            if(err){
                console.log(err.message);
                res.redirect('/sign-in'); 
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/sign-in');
    }
}

const requireMaxAuth = (req, res, next) => {
    const token = req.cookies.jwt;//assign the jwt token to the const

    //check json web token exists & is verified
    if(token){
        jwt.verify(token, "don't look", (err, decodedToken) => { //verify the json web token
            if(err){
                console.log(err.message);
                res.redirect('/sign-in'); 
            }else{
                if(decodedToken.userType !== "Admin"){
                    console.log("Invalid access", decodedToken.userType);
                    res.redirect('/');
                }else{
                    next();
                }
            }
        })
    }else{
        res.redirect('/sign-in');
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, "don't look", async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                // console.log(decodedToken, decodedToken.userType);
                let user = await User.findById(decodedToken.id);//find user in database
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

const preventEntry = (req, res, next) => {
    const token = req.cookies.jwt;//assign the jwt token to the const

    //check json web token exists & is verified
    if(token){
        jwt.verify(token, "don't look", (err, decodedToken) => { //verify the json web token
            if(err){
                console.log(err.message);
                res.redirect('/sign-in'); 
            }else{
                res.redirect('/');
            }
        })
    }else{
        next();
    }
}

module.exports = { requireAuth, requireMaxAuth, checkUser, preventEntry }; //export for use elsewhere