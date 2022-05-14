import express from 'express'
import { indexPage, notAuthorizedPage } from '../controllers/index'
import { signUserInAPI, allUsersAPI, updateUserAPI, deleteUserAPI, createUserAPI, loggedInUserRolesAPI } from '../controllers/users'
import { createRoleAPI, allRolesAPI, updateRoleAPI, deleteRoleAPI } from '../controllers/roles'
import { createAdmin } from '../controllers/createAdmin'
import { usersSortedByRole } from '../controllers/misc'

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
                    //res.redirect('/notauthorized')
                    res.status(401).json({ success: false, message: "autherror" })
                } else {
                    if (user.roles.length == 1) {
                        next()
                    } else {
                        //res.redirect('/notauthorized')
                        res.status(401).json({ success: false, message: "autherror" })
                    }
                }
            })
        } catch (err) {
            console.log("Hokey pokey", err)
            //res.redirect('/notauthorized')
            res.status(401).json({ success: false, message: "autherror" })
        }
    } else {
        // res.redirect('/signin')
        res.status(401).json({ success: false, message: "autherror" })
    }


}

function getEmail(req, app) {
    try {
        let userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
        return userDecoded.email
    } catch (err) {
        // this executes on log out -- when the cookie disappears
        return ""
    }
}


function isSignedIn(req) {
    try {
        jwt.verify(req.cookies.token, APP_SECRET)
        console.log("the cookie token: ", req.cookies.token.substring(req.cookies.token.length - 6))
        return true
    } catch (err) {
        return false
    }
    // }
}

function requireSignIn(req, res, next) {
    if (isSignedIn(req)) {
        next()
    } else {
        res.redirect('/signin')
        // one could redirect to /notauthorized as below but
        // since this is really notauthenticated the signin page is
        // where to direct the user
        //res.redirect('/notauthorized')
    }

}



export function configureRoutes(app) {
    app.all('*', (req, res, next) => {
        app.locals.signedIn = isSignedIn(req)
        app.locals.userEmail = getEmail(req)
        console.log('users signed in status: ', app.locals.signedIn)
        // if (app.locals.signedIn == false) {
        //     res.status(400).json({ success: false, message: "autherror" })
        // } else {
        //     next()
        // }
        next()
    })


    router.get('/', indexPage)
    router.get('/notauthorized', notAuthorizedPage)

    // Users
    router.post('/api/users/register', createUserAPI)
    router.post('/api/users/signin', signUserInAPI)
    router.get('/api/users', isAdmin, allUsersAPI)
    router.post('/api/users', isAdmin, createUserAPI)  //this route requires authorization
    router.put('/api/users/:id', isAdmin, updateUserAPI)  //this route requires authorization
    router.delete('/api/users/:id', isAdmin, deleteUserAPI) //this route requires authorization
    router.get('/api/users/roles', loggedInUserRolesAPI)

    // Roles
    router.post('/api/roles', isAdmin, createRoleAPI)  //this route requires authorization
    router.get('/api/roles', allRolesAPI)
    router.put('/api/roles/:id', isAdmin, updateRoleAPI)  //this route requires authorization
    router.delete('/api/roles/:id', isAdmin, deleteRoleAPI) //this route requires authorization

    // One time route for creating admin user with username "admin" and password "admin"
    router.get('/createAdmin', createAdmin)

    // Misc
    router.get('/api/roles/users', usersSortedByRole)

    app.use('/', router)
}