import express from 'express'
import {indexPage, dashBoardPage, signInPage, signUpPage, notAuthorizedPage} from '../controllers/index'
import {signUserInAPI, allUsersAPI, updateUserAPI, deleteUserAPI, createUserAPI} from '../controllers/users'
import {createRoleAPI, allRolesAPI, updateRoleAPI, deleteRoleAPI} from '../controllers/roles'

import jwt from 'jsonwebtoken'
import { APP_SECRET } from './vars'

let router = express.Router()



function isSignedIn(req){
        try{
            jwt.verify(req.cookies.token, APP_SECRET)
            console.log("the cookie token: ", req.cookies.token )
            return true
        }catch(err){
            return false
        }
    // }
}

function requireSignIn(req, res, next){
    if(isSignedIn(req)){
        next()
    }else{   
        res.redirect('/signin')
        // one could redirect to /notauthorized as below but
        // since this is really notauthenticated the signin page is
        // where to direct the user
        //res.redirect('/notauthorized')
    }    

}

export function configureRoutes(app){
    app.all('*', (req, res, next) =>{
        app.locals.signedIn = isSignedIn(req)
        console.log('users signed in status: ', app.locals.signedIn)
        next()
    })


    router.get('/', indexPage)
    router.get('/dashboard', requireSignIn, dashBoardPage) 


    router.get('/signup', signUpPage)  
    router.get('/signin', signInPage) 
    router.get('/notauthorized', notAuthorizedPage)

    // Users
    router.post('/api/users/register', createUserAPI)
    router.post('/api/users/signin', signUserInAPI)
    router.get('/api/users', allUsersAPI)
    router.post('/api/users', requireSignIn, createUserAPI)  //this route requires authorization
    router.put('/api/users/:id', requireSignIn, updateUserAPI)  //this route requires authorization
    router.delete('/api/users/:id',requireSignIn, deleteUserAPI) //this route requires authorization

    // Roles
    router.post('/api/roles', requireSignIn, createRoleAPI)  //this route requires authorization
    router.get('/api/roles', allRolesAPI)
    router.put('/api/roles/:id', requireSignIn, updateRoleAPI)  //this route requires authorization
    router.delete('/api/roles/:id',requireSignIn, deleteRoleAPI) //this route requires authorization


    app.use('/', router)
}