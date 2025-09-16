import React, { useState, createContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Admin from './Admin.jsx'
import DashCards from './DashCards.jsx'
import Users from './Admin/Users.jsx'
import Dev from './Dev.jsx'
import UserForm from './Admin/UserForm.jsx'
//333 Role related components needed here
import Teacher from './Teacher.jsx'
//444 Course related component needed here
//555 Course related component needed here */
import Other from './Other.jsx'
import Nav from './Nav.jsx'
import ErrorAPI from './ErrorAPI.jsx'
//111 SignIn and SignOut components needed here
//222 SignUpForm related component needed here
import { ToastContainer } from 'react-toastify'

export const AppContext = createContext()

export default function App() {

    // authenticated helps to determine what elements like "Log Out" or "Dashboard" to show in Nav.js
    let [authenticated, setAuthenticated] = useState(false)
    // this contains the logged in user's profile info (like firstname, lastname and their roles/role names)
    // used to display user info in nav, the roles info determines what tools to display in the dashboard
    let [profile, setProfile] = useState([])
    // users is the list of all users in the DB
    let [users, setUsers] = useState([])
    // roles is the list of all available roles in the DB (not the logged in user's roles which are in profile)
    let [roles, setRoles] = useState([])
    // courses is the list of courses that belong to the logged in teacher
    let [courses, setCourses] = useState([])
    // users who have the role student 
    let [students, setStudents] = useState([])

    function hasRole(role) {
        let roleFound = false;
        if (profile.roles){
            profile.roles.forEach(element => {
                if (element === role) {
                    roleFound = true;
                }
            });
        }

        return roleFound;
    }

    return (
        <AppContext.Provider value={{ authenticated, setAuthenticated, users, setUsers, roles, setRoles, hasRole, profile, setProfile, courses, setCourses, students, setStudents }}>
            <div className="react-stuff">
                <ToastContainer/>
                <Router>
                    <Routes>
                        <Route path="/" element={<Nav />} >
                            <Route
                                element={
                                    <main style={{ padding: "1rem" }}>
                                        <h2>My App</h2>
                                    </main>
                                }
                            />
                            {/* //111 after finishing and testing code for final project week 1
                            // remove the Dev component and put the index in the above route
                            // so it becomes the splash page */}
                            <Route index path="dev" element={<Dev />} ></Route>
                            {/* //111 Create route for SignInForm component */}
                            {/* //111 Create route for SignOut component */}  
                            {/* //222 Create a route to the SignUpForm Component */}
                            <Route path="errorapi" element={<ErrorAPI />} ></Route>
                            <Route path="dashboard" element={<DashCards />} ></Route>
                            <Route path="/admin" element={<Admin />}>
                                <Route path="users" element={<Users />}></Route>
                                {/* //222 Add two routes here for the UserForm component
                                //  the path for the
                                // two routes are "users/new and "users/:uid/edit
                                // this will enable you to create a new user or edit an
                                // existing user
                                //  */}

                                {/* //333 Add role related routing here */}
                            </Route>
                         
                            {/* //444 Routing for course related components needed here */}
                                {/* //555 Routing for courseform neede here */}
                            

                            <Route path="/other" element={<Other />}></Route>
                        </Route>
                    </Routes>
                </Router>

            </div >
        </AppContext.Provider >
    )
}



