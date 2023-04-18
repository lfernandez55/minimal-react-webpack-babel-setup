import mongoose from 'mongoose'

const Schema = mongoose.Schema

let OrganizationSchema = new Schema({
    name: String,
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Organization"
    },
    users: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            // type: String,
            // enum: ["admin", "member"]
            type: Schema.Types.ObjectId,
            ref: "Role"
        }
    }]
})

export let Organization = mongoose.model("Organization", OrganizationSchema)



// import mongoose from 'mongoose'

// const organizationSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   children: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Organization'
//   }]
// });



// const Organization = mongoose.model('Organization', organizationSchema);

// module.exports = Organization;