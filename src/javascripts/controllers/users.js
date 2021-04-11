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

//DELETE /api/users/:id
export const deleteUserAPI = (req, res, next) => {
    console.log("DEBUG DELETE USER", req.params.id)
    User.deleteOne({_id: req.params.id }).exec((err, projects)=> {
        if(err){
            res.json({success: false, message: "Delete Query failed"})
            res.end()
        }else{
            res.json({success: true, message: "Delete Query succeeded"})
            res.end()
        }
    })

}

// DELETE /api/users/:id
// export const deleteUserAPI = (req, res, next) => {
//     User.findOne({_id: req.params.id}).select('-reviews').exec((err, user)=> {
//         if(err){
//             res.json({success: false, message: "Unable to delete"})
//             res.end()
//         }else{
//             User.findByIdAndDelete(req.params.id, err=> {
//                 if(err){
//                     res.json({success: false, message: "Movie delete failed"})
//                     res.end()
//                 }else{
//                     res.end()
//                 }
//             })
//         }
//     })
// }
