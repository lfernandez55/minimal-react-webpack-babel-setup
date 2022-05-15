import React, { useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Admin from './Admin'
import { useCookies } from 'react-cookie'
import DashCards from './Admin/DashCards'
import Users from './Admin/Users'
import UserForm from './Admin/UserForm'
import Roles from './Admin/Roles'
import RoleForm from './Admin/RoleForm'
// import UsersByRole from './Admin/UsersByRole'
import Teacher from './Teacher'
import Other from './Other'
import Nav from './Nav'
import ErrorAPI from './ErrorAPI'

import SignInForm from './auth/SignInForm'
import SignUpForm from './auth/SignUpForm'
import SignOut from './auth/SignOut'

export const AppContext = createContext()

export default function App() {

    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    // authenticated helps to determine what elements like "Log Out" or "Dashboard" to show in Nav.js
    let [authenticated, setAuthenticated] = useState(cookies.token !== undefined)
    // this contains the logged in user's profile info (like firstname, lastname and their roles/role names)
    let [loggedInUser, setLoggedInUser] = useState([])
    // users is the list of all users in the DB
    let [users, setUsers] = useState([])
    // roles is the list of all available roles in the DB (not the logged in user's roles which are in loggedInUser)
    let [roles, setRoles] = useState([])
    // let [userRoles, setUserRoles] = useState([])
    console.log("dddd", authenticated)
    // function getRoles() {
    //     fetch('/api/users/roles', {
    //         method: "GET",
    //     })
    //         .then((response) => {
    //             return response.json();
    //         })
    //         .then((resp) => {
    //             console.log("setuserroles")
    //             console.log(resp)
    //             setUserRoles(resp)
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //         });
    // }

    function hasRole(role) {
        let roleFound = false;
        console.log("in has role")
        console.log(loggedInUser)
        loggedInUser.roles.forEach(element => {
            if (element.name === role) {
                roleFound = true;
            }
        });
        return roleFound;
    }

    return (
        <AppContext.Provider value={{ authenticated, setAuthenticated, users, setUsers, roles, setRoles, hasRole, loggedInUser, setLoggedInUser, setCookie, removeCookie }}>
            <div className="react-stuff">
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
                                {/* <Route path="usersbyrole" element={<UsersByRole />}></Route> */}
                            </Route>
                            <Route path="/teacher" element={<Teacher />}></Route>
                            <Route path="/other" element={<Other />}></Route>
                        </Route>
                    </Routes>
                </Router>

            </div >
        </AppContext.Provider >
    )
}



