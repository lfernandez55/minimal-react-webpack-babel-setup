import { Role } from '../models/role'
import { User } from '../models/user'

export const createAdmin = (req, res, next) => {

    const seedDB = async () => {
        try {

            // start fresh by removing all documents in the collections
            // when upgrading Mongoose from 5 to 8 this code needed updating.
            // in 5 one could use await Course.remove({})
            await User.deleteMany({});
            await Role.deleteMany({});

            let role1 = new Role
            role1.name = "admin"
            await role1.save()

            let user1 = new User
            user1.firstName = "admin"
            user1.lastName = "admin"
            user1.email = "admin@aa.edu"
            user1.username = "admin"
            user1.setPassword("asdf")
            user1.roles.push(role1)
            await user1.save()

            let role2 = new Role
            role2.name = "teacher"
            await role2.save()

            let user2 = new User
            user2.firstName = "Peter"
            user2.lastName = "Pedant"
            user2.email = "peter@aa.edu"
            user2.username = "peter"
            user2.setPassword("asdf")
            user2.roles.push(role2)
            await user2.save()

            //222 -- using code above as model add two accounts ("Daisy" and "Donald") with student role

            //444 -- add a course titled "WEB 3430" that is taught by Peter here.

            res.status(200).json({ success: true, message: "DB Seeded...." })

        } catch (err) {
            res.status(400).json({ success: false, message: err })
        }
    }

    seedDB()
}