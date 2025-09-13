// src/javascripts/config/routes.js
import express from 'express'
import { indexPage } from '../controllers/index.js'
import {
  allUsersAPI,
  updateUserAPI,
  deleteUserAPI,
  createUserAPI,
  allUsersWhoAreStudentsAPI
} from '../controllers/users.js'
import {
  allTeachersCoursesAPI,
  updateCourseAPI,
  deleteCourseAPI,
  createCourseAPI
} from '../controllers/courses.js'
import {
  createRoleAPI,
  allRolesAPI,
  updateRoleAPI,
  deleteRoleAPI,
  dashInfo
} from '../controllers/roles.js'
import { createAdmin } from '../controllers/createAdmin.js'

// Passport helpers
import { passport, ensureAuthenticated, requireRole } from '../config/passport.js'

const router = express.Router()

export function configureRoutes(app) {
  // Public
  router.get('/', indexPage)

router.post('/api/users/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    // ❌ Wrong creds → send clear JSON (from info.message)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || 'Invalid credentials'
      });
    }

    // ✅ Success → establish the session
    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        success: true,
        user, // {id, username, name?, roles?} depending on your strategy
        message: 'Successfully signed in.'
      });
    });
  })(req, res, next);
});


  // e.g., POST /logout
app.post('/api/users/signout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err2 => {
      if (err2) return next(err2);
      // Must match the cookie name you set in session() above
      res.clearCookie('expressSession', { path: '/' });  // add domain/sameSite if you set them
      return res.status(204).end(); // or res.redirect('/')
    });
  });
});


  // Registration (public by default; make admin-only if desired)
  router.post('/api/users/register', createUserAPI)

  // ----- Admin routes (must be authenticated + admin) -----
  router.get('/api/users', ensureAuthenticated, requireRole('admin'), allUsersAPI)
  router.post('/api/users', ensureAuthenticated, requireRole('admin'), createUserAPI)
  router.put('/api/users/:id', ensureAuthenticated, requireRole('admin'), updateUserAPI)
  router.delete('/api/users/:id', ensureAuthenticated, requireRole('admin'), deleteUserAPI)
 
  router.post('/api/roles', ensureAuthenticated, requireRole('admin'), createRoleAPI)
  router.get('/api/roles', ensureAuthenticated, requireRole('admin'), allRolesAPI)
  router.put('/api/roles/:id', ensureAuthenticated, requireRole('admin'), updateRoleAPI)
  router.delete('/api/roles/:id', ensureAuthenticated, requireRole('admin'), deleteRoleAPI)

  // ----- Teacher routes (must be authenticated + teacher) -----
  router.get('/api/courses', ensureAuthenticated, requireRole('teacher'), allTeachersCoursesAPI)
  router.post('/api/courses', ensureAuthenticated, requireRole('teacher'), createCourseAPI)
  router.put('/api/courses/:id', ensureAuthenticated, requireRole('teacher'), updateCourseAPI)
  router.delete('/api/courses/:id', ensureAuthenticated, requireRole('teacher'), deleteCourseAPI)
  router.get('/api/students', ensureAuthenticated, requireRole('teacher'), allUsersWhoAreStudentsAPI)

  // ----- Any authenticated user -----
  router.get('/api/dashinfo', ensureAuthenticated, dashInfo)

  // Utility/seed
  router.get('/api/createAdmin', createAdmin)

  app.use('/', router)
}


