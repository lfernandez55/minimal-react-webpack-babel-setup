import { Course } from '../models/course'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config/vars'

// POST /api/courses
export const createCourseAPI = async (req, res, next) => {
  try {
    const { name, enrolledStudents } = req.body

    // jwt.verify can throw; wrap in try/catch or handle here
    const userDecoded = jwt.verify(req.cookies.token, APP_SECRET)

    const course = new Course({
      name,
      enrolledStudents,
      teacher: userDecoded._id,
    })

    await course.save() // no callback in Mongoose 8

    return res.status(201).json({ success: true, message: 'Course creation successful' })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        errorCode: err.code,
        message:
          'Most likely you are trying to create a course with a name that already exists. Try a different course name.',
      })
    }
    // JWT errors or validation errors land here too
    return res.status(400).json({ success: false, message: err?.message || String(err) })
  }
}

// GET /api/courses (teacher’s courses)
export const allTeachersCoursesAPI = async (req, res, next) => {
  try {
    const userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
    const courses = await Course.find({ teacher: userDecoded._id }) // no callbacks
    // Optional: res.json handles serialization
    return res.status(200).json(courses)
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || 'Query failed' })
  }
}

// PUT /api/courses/:id
export const updateCourseAPI = async (req, res, next) => {
  try {
    // Option A: atomic update with validation
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    return res.status(200).json({ success: true, message: 'Course update successful' })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        errorCode: err.code,
        message:
          'Most likely you are trying to update a course to a name that already exists. Try a different name.',
      })
    }
    return res.status(400).json({ success: false, message: err?.message || 'Unable to update' })
  }
}

// DELETE /api/courses/:id
export const deleteCourseAPI = async (req, res, next) => {
  try {
    const result = await Course.deleteOne({ _id: req.params.id }) // no callback
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }
    return res.status(200).json({ success: true, message: 'Delete succeeded' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || 'Delete failed' })
  }
}
