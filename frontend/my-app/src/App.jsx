import React, { useState, createContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Admin from './Admin.jsx'
import DashCards from './DashCards.jsx'
import Users from './Admin/Users.jsx'
import UserForm from './Admin/UserForm.jsx'
import Roles from './Admin/Roles.jsx'
import RoleForm from './Admin/RoleForm.jsx'
import Teacher from './Teacher.jsx'
import Courses from './Teacher/Courses.jsx'
import CourseForm from './Teacher/CourseForm.jsx'
import Other from './Other.jsx'
import Nav from './Nav.jsx'
import ErrorAPI from './ErrorAPI.jsx'

import SignInForm from './Auth/SignInForm.jsx'
import SignUpForm from './Auth/SignUpForm.jsx'
import SignOut from './Auth/SignOut.jsx'
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
                                index
                                element={
                                    <main style={{ padding: "1rem" }}>
                                        <h2>My App</h2>
                                    </main>
                                }
                            />
                            <Route path="signin" element={<SignInForm />} ></Route>
                            <Route path="signup" element={<SignUpForm />} ></Route>
                            <Route path="signout" element={<SignOut />} ></Route>
                            <Route path="errorapi" element={<ErrorAPI />} ></Route>
                            <Route path="dashboard" element={<DashCards />} ></Route>
                            <Route path="/admin" element={<Admin />}>
                                <Route path="users" element={<Users />}></Route>
                                <Route path="users/new" element={<UserForm />}></Route>
                                <Route path="users/:uid/edit" element={<UserForm />}></Route>


                                <Route path="roles" element={<Roles />}></Route>
                                <Route path="roles/new" element={<RoleForm />}></Route>
                                <Route path="roles/:rid/edit" element={<RoleForm />}></Route>
                            </Route>
                         
                            <Route path="/teacher" element={<Teacher />}>
                                <Route path="courses" element={<Courses />}></Route>
                                <Route path="courses/new" element={<CourseForm />}></Route>
                                <Route path="courses/:courseid/edit" element={<CourseForm />}></Route>
                            </Route>

                            <Route path="/other" element={<Other />}></Route>
                        </Route>
                    </Routes>
                </Router>

            </div >
        </AppContext.Provider >
    )
}



