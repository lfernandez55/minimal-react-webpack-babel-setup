import express from 'express'
import { indexPage } from '../controllers/index'
import { signUserInAPI, allUsersAPI, updateUserAPI, deleteUserAPI, createUserAPI } from '../controllers/users'
import { createRoleAPI, allRolesAPI, updateRoleAPI, deleteRoleAPI } from '../controllers/roles'
import { createAdmin } from '../controllers/createAdmin'

import jwt from 'jsonwebtoken'
import { APP_SECRET } from './vars'
import { User } from '../models/user'

let router = express.Router()

function isAdmin(req, res, next) {
    if (isSignedIn(req)) {
        try {
            let userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
            User.findById({ _id: userDecoded._id }).populate({
                path: 'roles',
                match: { name: 'admin' }
            }).exec((err, user) => {
                if (err) {
                    console.log("Unable to process role code")
                    res.status(401).json({ success: false, message: "autherror" })
                } else {
                    if (user.roles.length == 1) {
                        next()
                    } else {
                        res.status(401).json({ success: false, message: "autherror" })
                    }
                }
            })
        } catch (err) {
            res.status(401).json({ success: false, message: "autherror" })
        }
    } else {
        res.status(401).json({ success: false, message: "autherror" })
    }


}


function isSignedIn(req) {
    console.log("IN ISSIGNEDIN")
    try {
        jwt.verify(req.cookies.token, APP_SECRET)
        console.log("the cookie token: ", req.cookies.token.substring(req.cookies.token.length - 6))
        return true
    } catch (err) {
        return false
    }
    // }
}


export function configureRoutes(app) {
    app.all('*', (req, res, next) => {
        app.locals.signedIn = isSignedIn(req)
        console.log('users signed in status: ', app.locals.signedIn)
        next()
    })
    router.get('/', indexPage)

    // Users
    router.post('/api/users/register', createUserAPI)
    router.post('/api/users/signin', signUserInAPI)
    router.get('/api/users', isAdmin, allUsersAPI) // this route requires admin authorization
    router.post('/api/users', isAdmin, createUserAPI)  //this route requires admin authorization
    router.put('/api/users/:id', isAdmin, updateUserAPI)  //this route requires admin authorization
    router.delete('/api/users/:id', isAdmin, deleteUserAPI) //this route requires admin authorization

    // Roles
    router.post('/api/roles', isAdmin, createRoleAPI)  //this route requires admin authorization
    router.get('/api/roles', isAdmin, allRolesAPI) // this route requires admin authorization
    router.put('/api/roles/:id', isAdmin, updateRoleAPI)  //this route requires admin authorization
    router.delete('/api/roles/:id', isAdmin, deleteRoleAPI) //this route requires admin authorization

    // One time route for creating admin user with username "admin" and password "admin"
    router.get('/api/createAdmin', createAdmin)

    app.use('/', router)
}