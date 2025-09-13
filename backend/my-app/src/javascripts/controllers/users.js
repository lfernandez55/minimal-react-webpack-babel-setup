// src/javascripts/controllers/users.js
import { User } from '../models/user.js'
import { Role } from '../models/role.js'

// CREATE user
export const createUserAPI = async (req, res) => {
  try {
    const user = new User()
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.email = req.body.email
    user.username = req.body.username
    user.setPassword(req.body.password)
    user.roles = req.body.roles

    await user.save()
    return res.status(200).json({ success: true, message: 'User created' })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        errorCode: err.code,
        message: 'Duplicate key error'
      })
    }
    return res.status(500).json({ success: false, message: err.message })
  }
}

// READ all users
export const allUsersAPI = async (req, res) => {
  try {
    const users = await User.find().populate('roles')
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ success: false, message: 'Query failed' })
  }
}

// READ all students
export const allUsersWhoAreStudentsAPI = async (req, res, next) => {
  try {
    const role = await Role.findOne({ name: 'student' }).lean();
    if (!role) {
      return res.send(JSON.stringify([]));
    }

    const students = await User.find({ roles: role._id }).lean();
    res.send(JSON.stringify(students));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Query failed', err });
  }
};

// UPDATE user
export const updateUserAPI = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.email = req.body.email
    user.username = req.body.username
    if (req.body.password) user.setPassword(req.body.password)
    user.roles = req.body.roles

    await user.save()
    res.status(200).json({ success: true, message: 'User updated' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// DELETE user
export const deleteUserAPI = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed' })
  }
}


