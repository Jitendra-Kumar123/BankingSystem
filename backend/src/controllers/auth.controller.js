const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

async function userRegisterController(req, res){
    const {email , userName, password } = req.body;

    const isUserExists = await userModel.findOne({
        email: email
    })

    if(isUserExists){
        return res.status(422).json({
            message: "user already exists",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, userName, password
    })

    const token = jwt.sign({userId: user._id}, 
        
            process.env.JWT_SECRET
        ,
        {
            expiresIn: '3d'
        }
    )

    res.cookie("token", token);

    res.status(201).json({
        message: "user registered successfully",
        user: {
            userId: user._id,
            email: user.email,
            userName: user.userName
        }, 
        token
    })
}

module.exports = {
    userRegisterController,
}