import mongoose from 'mongoose'

const Schema = mongoose.Schema

let RoleSchema = new Schema({
    name: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
})

export let Role = mongoose.model("Role", RoleSchema)