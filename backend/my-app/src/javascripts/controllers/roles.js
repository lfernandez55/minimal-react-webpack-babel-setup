import { Role } from '../models/role'

// CREATE role
export const createRoleAPI = async (req, res, next) => {
    try {
        let role = new Role({
            name: req.body.name
        })
        await role.save()
        console.log("Role saved")
        res.status(200).json({ success: true, message: "Role saved" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Unable to create role" })
    }
}

// GET /api/roles
export const allRolesAPI = async (req, res, next) => {
    try {
        const roles = await Role.find().exec()
        res.json(roles)
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Query failed" })
    }
}

// UPDATE role
export const updateRoleAPI = async (req, res, next) => {
    try {
        await Role.updateOne(
            { _id: req.params.id },
            { name: req.body.name }
        )
        res.status(200).json({ success: true, message: "Update succeeded", _id: req.params.id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Update failed" })
    }
}

// DELETE role
export const deleteRoleAPI = async (req, res, next) => {
    try {
        await Role.deleteOne({ _id: req.params.id })
        res.status(200).json({ success: true, message: "Delete Query succeeded" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "Delete Query failed" })
    }
}

// Example info
export const dashInfo = (req, res, next) => {
    res.status(200).json({ 
        success: true, 
        message: "Example info only available to logged in user" 
    })
}
