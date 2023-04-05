import mongoose from 'mongoose'

const Schema = mongoose.Schema

let OrganizationSchema = new Schema({
    name: String,
    children: [{
            type: Schema.Types.ObjectId,
            ref: "Organization"
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