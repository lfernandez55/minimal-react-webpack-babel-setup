import express from 'express'
import {indexPage, dashBoardPage, signInPage, signUpPage, notAuthorizedPage} from '../controllers/index'
import {registerUserAPI, signUserInAPI, allUsersAPI, deleteUserAPI} from '../controllers/users'
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
        res.redirect('/notauthorized')
        // res.status(401)
        // res.end()
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

    //Users
    router.post('/api/users/register', registerUserAPI)
    router.post('/api/users/signin', signUserInAPI)
    router.get('/api/users', allUsersAPI)
    // router.delete('/api/users/:id', requireSignIn, deleteUserAPI) //this route requires authorization
    router.delete('/api/users/:id',requireSignIn, deleteUserAPI) //this route requires authorization


    app.use('/', router)
}