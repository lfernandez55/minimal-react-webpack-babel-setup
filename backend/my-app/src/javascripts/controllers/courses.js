import { Course } from '../models/course.js'

// POST /api/courses
export const createCourseAPI = async (req, res, next) => {
  //555Code needed here */
}

// GET /api/courses (teacher’s courses)
export const allTeachersCoursesAPI = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user.id })
    // Optional: res.json handles serialization
    return res.status(200).json(courses)
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || 'Query failed' })
  }
}

// PUT /api/courses/:id
export const updateCourseAPI = async (req, res, next) => {
  //555code needed here */
}

// DELETE /api/courses/:id
export const deleteCourseAPI = async (req, res, next) => {
  //555Code needed here */
}
