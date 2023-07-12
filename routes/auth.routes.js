const express = require('express')
const router = require("express").Router();
const bcrypt = require("bcryptjs")
const User =require('../models/User.model');

router.get('/signup', (req, res, next) => {
    res.render("auth/signup")
})

router.post('/signup', async(req, res, next) => {
    
    userInfo = req.body
    const salt = bcrypt.genSaltSync(13)
    userInfo.password = bcrypt.hashSync(userInfo.password, salt)
    console.log(userInfo)
    try{
        const newUser = await User.create(userInfo)
        

     res.redirect("/")   
    } catch (error){
        console.log(error)
    }
    
})

router.get('/login', (req, res, next) => {
    
    
    res.render("auth/login")
})

router.post('/login', async(req, res, next) => {
    
    userInfo = req.body
    console.log(userInfo)

    try{ 
    userExist = await User.findOne({username: userInfo.username})
    console.log(userExist)
     if (userExist) {
        let passwordMatch = bcrypt.compareSync(userInfo.password,userExist.password)
        userExist.password ="*****"
        req.session.user=userExist
        console.log()
        res.redirect("/profile") 
     }
        
     else{
        res.render('auth/login',{errorMsg: "Invalid username/password"})
     } 
    } catch (error){
        console.log(error)
    }
    
})

module.exports = router;