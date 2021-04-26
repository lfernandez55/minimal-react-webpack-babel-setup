import {Role} from '../models/role'
import {User} from '../models/user'

export const usersSortedByRole = (req, res, next) => {

    const getRolesWithPopulate = function() {
        //return db.Role.find().populate("users");
        // return Role.find()
        Role.find().exec((err, roles)=> {
            if(err){
                res.json({success: false, message: "Query failed"})
                res.end()
            }else{
                return roles
            }
        })
      };

      const run = async function() {
        try {
            let rolesQuery = await Role.find().populate("users").exec();
            console.log("Roles Query", rolesQuery);
            res.status(200).json(rolesQuery)
        } catch (error) {
            res.status(400).json({successx: false, message: error})
        }
      };
      run()
}


export const populateUsersInRoles = (user, usersRoleIds) => {

    usersRolesIds.forEach( usersRolesId => {
        Role.findById().exec((err, role)=> {
            if(err){
                res.json({success: false, message: "Query failed"})
                res.end()
            }else{
                if (role.users.includes(user._id) === false) role.users.push(user._id)
            }
        })
        //;
    });

    const getRolesWithPopulate = function() {
        //return db.Role.find().populate("users");
        // return Role.find()
        Role.find().exec((err, roles)=> {
            if(err){
                res.json({success: false, message: "Query failed"})
                res.end()
            }else{
                return roles
            }
        })
      };

      const run = async function() {
        try {
            // let rolesQuery = await getRolesWithPopulate();
            //let rolesQuery = await User.findById("60838c8ded651a40f861116d").populate("roles").exec();
            //let rolesQuery = await User.find().populate("roles").exec();
            let rolesQuery = await Role.find().populate("users").exec();
            console.log("Roles Query", rolesQuery);
            res.status(200).json({success: true, message: rolesQuery})
        } catch (error) {
            res.status(400).json({successx: false, message: error})
        }
      };
      run()
}