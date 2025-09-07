import express from 'express'
import { indexPage } from '../controllers/index'
import { signUserInAPI, allUsersAPI, updateUserAPI, deleteUserAPI, createUserAPI, allUsersWhoAreStudentsAPI } from '../controllers/users'
import { allTeachersCoursesAPI, updateCourseAPI, deleteCourseAPI, createCourseAPI } from '../controllers/courses'
import { createRoleAPI, allRolesAPI, updateRoleAPI, deleteRoleAPI, dashInfo } from '../controllers/roles'
import { createAdmin } from '../controllers/createAdmin'

import jwt from 'jsonwebtoken'
import { APP_SECRET } from './vars'
import { User } from '../models/user'

let router = express.Router()

function isTeacher(req, res, next) {
  if (verifyJWTToken(req)) {
    try {
      const userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
      if (userDecoded.roles.find(role => role.name === 'teacher')) {
        return next()
      }
      return res.status(403).json({
        success: false,
        message: 'Aautherror: client authenticated but does not have permission to access the requested resource'
      })
    } catch (_err) {
      return res.status(500).json({
        success: false,
        message: 'Autherror: the server encountered an unexpected condition that prevented it from fulfilling the request.'
      })
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Autherror: client failed to authenticate with the server.'
    })
  }
}

// ✅ UPDATED: no callbacks passed to `.exec()`. Use async/await instead.
async function isAdmin(req, res, next) {
  if (!verifyJWTToken(req)) {
    return res.status(401).json({
      success: false,
      message: 'Autherror: client failed to authenticate with the server.'
    })
  }

  try {
    const userDecoded = jwt.verify(req.cookies.token, APP_SECRET)

    // No callback; await the promise. You can omit `.exec()` entirely when using await.
    const user = await User.findById(userDecoded._id)
      .populate({ path: 'roles', match: { name: 'admin' } })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Autherror: user not found.'
      })
    }

    const roleFound = (user.roles ?? []).some(r => /^(admin)$/i.test(r.name))

    if (roleFound) {
      return next()
    }

    return res.status(403).json({
      success: false,
      message: 'Aautherror: client authenticated but does not have permission to access the requested resource'
    })
  } catch (_err) {
    return res.status(500).json({
      success: false,
      message: 'Autherror: the server encountered an unexpected condition that prevented it from fulfilling the request.'
    })
  }
}

function isLoggedIn(req, res, next) {
  if (verifyJWTToken(req)) {
    return next()
  }
  return res.status(401).json({ success: false, message: 'Autherror: You are not signed in.' })
}

function verifyJWTToken(req) {
  try {
    const token = req.cookies?.token
    jwt.verify(token, APP_SECRET)
    if (token?.length >= 6) {
      console.log('the cookie token: ', token.substring(token.length - 6))
    }
    return true
  } catch {
    return false
  }
}

export function configureRoutes(app) {
  router.get('/', indexPage)

  // Users
  router.post('/api/users/register', createUserAPI)
  router.post('/api/users/signin', signUserInAPI)
  router.get('/api/users', isAdmin, allUsersAPI)
  router.get('/api/students', allUsersWhoAreStudentsAPI)

  router.post('/api/users', isAdmin, createUserAPI)
  router.put('/api/users/:id', isAdmin, updateUserAPI)
  router.delete('/api/users/:id', isAdmin, deleteUserAPI)

  // Courses
  router.get('/api/courses', isTeacher, allTeachersCoursesAPI)
  router.post('/api/courses', isTeacher, createCourseAPI)
  router.put('/api/courses/:id', isTeacher, updateCourseAPI)
  router.delete('/api/courses/:id', isTeacher, deleteCourseAPI)

  // Roles
  router.post('/api/roles', isAdmin, createRoleAPI)
  router.get('/api/roles', isAdmin, allRolesAPI)
  router.put('/api/roles/:id', isAdmin, updateRoleAPI)
  router.delete('/api/roles/:id', isAdmin, deleteRoleAPI)

  // Dashboard
  router.get('/api/dashinfo', isLoggedIn, dashInfo)

  // One-time route for seeding admin
  router.get('/api/createAdmin', createAdmin)

  app.use('/', router)
}
