import passport from 'passport'
import {Role} from '../models/role'

export const createRoleAPI = (req, res, next) => {

    let role = new Role
    role.name = req.body.name

    role.save(err => {
        if (err){
            res.json({success: false, message: "Undable to create role"})
            console.log(err)
            res.end()
        }else{
            console.log("Role saved")
            res.end()
        }
    })

}

//GET /api/roles
export const allRolesAPI = (req, res, next) => {
    Role.find().exec((err, roles)=> {
        if(err){
            res.json({success: false, message: "Query failed"})
            res.end()
        }else{
            res.send(JSON.stringify(roles))
        }
    })
}


// update role api
export const updateRoleAPI = (req, res, next) => {

    Role.updateOne({_id:req.params.id},{name: req.body.name}, (err, doc) => {
        if (err) {
            res.json({success: false, message: "PUT Query failed"})
            res.end()
        } else {
            res.json({success: true, message: "PUT Query succeeded",  _id: req.params.id})
            res.end()
        }
      });

}

// //DELETE /api/users/:id
export const deleteRoleAPI = (req, res, next) => {
    Role.deleteOne({_id: req.params.id }).exec((err, roles)=> {
        if(err){
            res.json({success: false, message: "Delete Query failed"})
            res.end()
        }else{
            res.json({success: true, message: "Delete Query succeeded"})
            res.end()
        }
    })

}

