import { Course } from '../models/course'

import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config/vars'


// used for registration. and for creating new users in admin tools
export const createCourseAPI = (req, res, next) => {
    let course = new Course
    course.name = req.body.name
    course.enrolledStudents = req.body.enrolledStudents

    let userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
    course.teacher = userDecoded._id
    console.log("in createcourseapi", req.body.name,'zzzz', course.name)
    course.save(err => {
        if (err) {
            // err.code indicates that a duplicate key violation occurred
            if (err.code == 11000) {
                // 409 ("The request could not be completed due to a conflict with the current state of the resource)
                res.status(409).json({ success: false, errorCode: err.code, message: "Most likely you are trying to create an course with a name that already exists. Try a different course name." })
            } else {
                res.status(400).json({ success: false, message: err })
            }
            res.end()
        } else {
            res.status(200).json({ success: true, message: "Course creation successful" })
            res.end()
        }
    })

}



//GET /api/users
export const allTeachersCoursesAPI = (req, res, next) => {
    let userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
    Course.find({teacher: userDecoded._id}).exec((err, courses) => {
        if (err) {
            res.status(500).json({ success: false, message: "Query failed" })
            res.end()
        } else {
            console.log("DEBG")
            console.log(courses)
            res.send(JSON.stringify(courses))
        }
    })
}



// PUT /api/users/:id  (update user)
export const updateCourseAPI = (req, res, next) => {
    Course.findOne({ _id: req.params.id }).exec((err, course) => {
        if (err) {
            res.status(500).json({ success: false, message: "Unable to update" })
            res.end()
        } else {
            Object.assign(course, req.body)
            console.log("DEBUG body",req.body)
            console.log("DEBUG",course)
            course.save((err) => {
                if (err) {
                    // err.code 11000 indicates that a duplicate key violation occurred
                    console.log("err.code", err.code)
                    if (err.code == 11000) {
                        res.status(409).json({ success: false, errorCode: err.code, message: "Most likely you are trying to create a course with an existing name. Try a different name." })
                    } else {
                        res.status(400).json({ success: false, message: err })
                    }
                    res.end()
                } else {
                    res.status(200).json({ success: true, message: "Course update successful" })
                    res.end()
                }
            })
        }
    })
}





//DELETE /api/users/:id
export const deleteCourseAPI = (req, res, next) => {
    Course.deleteOne({ _id: req.params.id }).exec((err, course) => {
        if (err) {
            res.status(500).json({ success: false, message: "Delete Query failed" })
            res.end()
        } else {
            res.status(200).json({ success: true, message: "Delete Query succeeded" })
            res.end()
        }
    })

}
