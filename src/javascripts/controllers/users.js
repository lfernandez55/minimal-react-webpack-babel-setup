import passport from 'passport'
import {User} from '../models/user'

//the first api call that supports registration....
export const registerUserAPI = (req, res, next) => {

    let user = new User
    user.firstname = req.body.firstName
    user.lastname = req.body.lastName
    user.email = req.body.email
    user.username = req.body.username
    user.setPassword(req.body.password)  

    user.save(err => {
        if (err){
            res.json({success: false, message: "Undable to register user"})
            console.log(err)
            res.end()
        }else{
            console.log("USER SAVED!!! --------------------")
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
                console.log("USER AUTHENTICATED. . . . . . . . . . ")
                res.cookie("token", token, { maxAge:1000 * 60 * 3 /* 60 * 24 */ })
                // res.json({token: token})
                res.end()
            }else{
                res.status(401).json(err)
                res.end()
            }
        }
    })(req, res, next)  //passport.authenticate returns a function which we are calling here, hence no commas
}