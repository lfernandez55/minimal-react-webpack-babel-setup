import mongoose from 'mongoose'

const Schema = mongoose.Schema

let CourseSchema = new Schema({
    name: String,
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    enrolledStudents: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    
})

export let Course = mongoose.model("Course", CourseSchema)