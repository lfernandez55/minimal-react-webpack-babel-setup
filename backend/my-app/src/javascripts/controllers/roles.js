import { Role } from '../models/role.js'

// CREATE role
export const createRoleAPI = async (req, res, next) => {
    //333 Query needed here
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
    //333 query needed here
}

// DELETE role
export const deleteRoleAPI = async (req, res, next) => {
    //333 query needed here
}

// Example info
export const dashInfo = (req, res, next) => {
    res.status(200).json({ 
        success: true, 
        message: "Example info only available to logged in user" 
    })
}
