// src/javascripts/models/user.js
import mongoose from 'mongoose'
import crypto from 'crypto'
import { Role } from './role.js'

const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, unique: true, required: true, trim: true },
  username:  { type: String, unique: true, required: true, trim: true },
  hash:      { type: String },
  salt:      { type: String },
  roles:     [{ type: Schema.Types.ObjectId, ref: 'Role' }]
})

// Password helpers
userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex')
}

userSchema.methods.isValidPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex')
  return this.hash === hash
}

// Optional convenience (if you ever populate roles and want easy checks)
userSchema.methods.hasRole = function (roleName) {
  if (!this.roles) return false
  return this.roles.some(r => r.name === roleName)
}

export const User = mongoose.model('User', userSchema)

