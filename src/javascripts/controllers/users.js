import passport from 'passport'
import {User} from '../models/user'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config/vars'

// used for registration. and for creating new users in admin tools
export const createUserAPI = (req, res, next) => {

    let user = new User
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.email = req.body.email
    user.username = req.body.username
    user.setPassword(req.body.password)  
    user.roles = req.body.roles
    user.synchWithChild()
    user.save(err => {
        if (err){
            // err.code indicates that a duplicate key violation occurred
            if (err.code == 11000){
                res.status(200).json({success: false, errorCode:err.code, message: "Most likely you are trying to create an account with a username or email that already exists. Try a different email and/or username."})
            } else {
                res.status(400).json({success: false, message: err})
            }
            res.end()
        }else{
            res.status(200).json({success: true, message: "Account creation successful"})
            res.end()
        }
    })

}

export const signUserInAPI = (req,res, next) => {
    passport.authenticate('local', (err,user, info) => {
        if(err){
            res.status(404).json(err)
            res.end()
        }else{
            if(user){
                let token = user.generateJWT()
                console.log("User authenticated. . . .")
                res.cookie("token", token, { maxAge:1000 * 60 * 60 })
                // above cookie expires after 60 minutes
                res.end()
            }else{
                res.status(401).json(err)
                res.end()
            }
        }
    })(req, res, next)  //passport.authenticate returns a function which we are calling here, hence no commas
}

/////////// Standard CRUD Methods Below

//GET /api/users
export const allUsersAPI = (req, res, next) => {
    User.find().exec((err, users)=> {
        if(err){
            res.json({success: false, message: "Query failed"})
            res.end()
        }else{
            res.send(JSON.stringify(users))
        }
    })
}



// PUT /api/users/:id
export const updateUserAPI = (req, res, next) => {
    User.findOne({_id: req.params.id}).exec((err, user)=> {
        if(err){
            res.json({success: false, message: "Unable to update"})
            res.end()
        }else{
            Object.assign(user, req.body)
            if (req.body.password != "dummy"){
                user.setPassword(req.body.password) 
            }
            user.synchWithChild()
            user.save((err)=> {
                if (err){
                    // err.code 11000 indicates that a duplicate key violation occurred
                    if (err.code == 11000){
                        res.status(200).json({success: false, errorCode:err.code, message: "Most likely you are trying to create an account with a username or email that already exists. Try a different email and/or username."})
                    } else {
                        res.status(400).json({success: false, message: err})
                    }
                    res.end()
                }else{
                    res.status(200).json({success: true, message: "Account update successful"})
                    res.end()
                }
            })
        }
    })
}





//DELETE /api/users/:id
export const deleteUserAPI = (req, res, next) => {
    User.deleteOne({_id: req.params.id }).exec((err, user)=> {
        if(err){
            res.json({success: false, message: "Delete Query failed"})
            res.end()
        }else{
            res.json({success: true, message: "Delete Query succeeded"})
            res.end()
        }
    })

}




//GET /api/users
export const loggedInUserRolesAPI = (req, res, next) => {
    try{
        let userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
        User.findById({_id: userDecoded._id}). populate({
        path: 'roles' 
        }).exec((err, user)=> {
            if(err){
                res.status(400).json({success: false, message: err})
            }else{
                res.status(200).json( user.roles)
            }
        })
    }catch(err){
        res.status(400).json({success: false, message: err})
    }
}

