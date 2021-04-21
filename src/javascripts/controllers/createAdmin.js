import {Role} from '../models/role'
import {User} from '../models/user'

export const createAdmin = (req, res, next) => {

    const removeDocs = async() => {
        try {
          await User.remove({}).exec();
          await Role.remove({}).exec();

          let role = new Role
          role.name = "admin"
          await role.save().exec()

          let user = new User
          user.firstName = "admin"
          user.lastName = "admin"
          user.email = "admin@aa.edu"
          user.username = "admin"
          user.setPassword("admin")  
          user.roles.push(role)

          await user.save().exec()
          res.status(200).json({success: true, message: "Admin account creation successful"})

        } catch (err) {
          return 'error occured';
        }
    }

    removeDocs()

    // let role = new Role
    // role.name = "admin"

    // role.save(err => {
    //     if (err){
    //         res.json({success: false, message: "Undable to create role"})
    //         console.log(err)
    //     }else{
    //         console.log("ROLE SAVED!!! --------------------")
    //     }
    // })

    // console.log(role)
    // let user = new User
    // user.firstName = "admin"
    // user.lastName = "admin"
    // user.email = "admin@aa.edu"
    // user.username = "admin"
    // user.setPassword("admin")  
    // user.roles.push(role)

    // user.save(err => {
    //     if (err){
    //         // err.code indicates that a duplicate key violation occurred
    //         if (err.code == 11000){
    //             res.status(200).json({success: false, errorCode:err.code, message: "Most likely you are trying to create an account with a username or email that already exists. Try a different email and/or username."})
    //         } else {
    //             res.status(400).json({success: false, message: err})
    //         }
    //         res.end()
    //     }else{
    //         res.status(200).json({success: true, message: "Admin account creation successful"})
    //         res.end()
    //     }
    // })



}