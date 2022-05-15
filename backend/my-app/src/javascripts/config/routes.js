import express from 'express'
import { indexPage, notAuthorizedPage } from '../controllers/index'
import { signUserInAPI, allUsersAPI, updateUserAPI, deleteUserAPI, createUserAPI } from '../controllers/users'
import { createRoleAPI, allRolesAPI, updateRoleAPI, deleteRoleAPI } from '../controllers/roles'
import { createAdmin } from '../controllers/createAdmin'
import { usersSortedByRole } from '../controllers/misc'

import jwt from 'jsonwebtoken'
import { APP_SECRET } from './vars'
import { User } from '../models/user'

let router = express.Router()

function isAdmin(req, res, next) {
    console.log("IN ISADMIN")
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


// function isLoggedIn(req, res, next) {
//     console.log("IN ISLOGGEDIN")
//     if (isSignedIn(req)) {
//         //continue
//     } else {
//         // res.redirect('/signin')
//         res.status(401).json({ success: false, message: "autherror" })
//     }


// }


// function getEmail(req, app) {
//     try {
//         let userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
//         return userDecoded.email
//     } catch (err) {
//         // this executes on log out -- when the cookie disappears
//         return ""
//     }
// }


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

// function requireSignIn(req, res, next) {
//     if (isSignedIn(req)) {
//         next()
//     } else {
//         res.redirect('/signin')
//         // one could redirect to /notauthorized as below but
//         // since this is really notauthenticated the signin page is
//         // where to direct the user
//         //res.redirect('/notauthorized')
//     }

// }



export function configureRoutes(app) {
    // app.all('*', (req, res, next) => {
    //     app.locals.signedIn = isSignedIn(req)
    //     // app.locals.userEmail = getEmail(req)
    //     console.log('users signed in status: ', app.locals.signedIn)
    //     // if (app.locals.signedIn == false) {
    //     //     res.status(400).json({ success: false, message: "autherror" })
    //     // } else {
    //     //     next()
    //     // }
    //     next()
    // })


    router.get('/', indexPage)
    router.get('/notauthorized', notAuthorizedPage)

    // Users
    router.post('/api/users/register', createUserAPI)
    router.post('/api/users/signin', signUserInAPI)
    router.get('/api/users', isAdmin, allUsersAPI) // this route requires admin authorization
    router.post('/api/users', isAdmin, createUserAPI)  //this route requires admin authorization
    router.put('/api/users/:id', isAdmin, updateUserAPI)  //this route requires admin authorization
    router.delete('/api/users/:id', isAdmin, deleteUserAPI) //this route requires admin authorization

    // router.get('/api/users/roles', loggedInUserRolesAPI) //this route returns success:false if session is not available which is handled client side

    // Roles
    router.post('/api/roles', isAdmin, createRoleAPI)  //this route requires admin authorization
    router.get('/api/roles', isAdmin, allRolesAPI) // this route requires admin authorization
    router.put('/api/roles/:id', isAdmin, updateRoleAPI)  //this route requires admin authorization
    router.delete('/api/roles/:id', isAdmin, deleteRoleAPI) //this route requires admin authorization

    // One time route for creating admin user with username "admin" and password "admin"
    router.get('/api/createAdmin', createAdmin)

    // Misc
    router.get('/api/roles/users', isAdmin, usersSortedByRole) // this route requires admin authorization

    app.use('/', router)
}