import mongoose from 'mongoose'
import crypto from 'crypto'  //for encrypting and decrypting tokens

import {APP_SECRET, AUTH_TOKEN_EXPIRES_IN} from '../config/vars'
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema



let userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    hash: String,
    salt: String
})

// for explantation see 
// https://1533221.mediaspace.kaltura.com/media/Backend+authentication+%28Part+2A+User+schema%29/1_qvtrej0f
// min 5:40
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'sha512').toString('hex')
}

userSchema.methods.isValidPassword = function(password){
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 128, 'sha512').toString('hex')
    return this.hash === hash
}

userSchema.methods.generateJWT = function(){
    let expireOn = new Date()
    expireOn.setDate(expireOn.getDate() + AUTH_TOKEN_EXPIRES_IN)

    return jwt.sign({
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        exp: parseInt(expireOn.getTime() / 1000)
    }, APP_SECRET)

}

export let User = mongoose.model("User", userSchema)