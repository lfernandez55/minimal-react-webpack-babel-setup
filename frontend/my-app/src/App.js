import React, { useState, createContext, useEffect } from 'react'
import { Routes, Route, Link, Outlet } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Admin from './Admin'
import { useCookies } from 'react-cookie'
import DashCards from './Admin/DashCards'
import Users from './Admin/Users'
import UserForm from './Admin/UserForm'
import Roles from './Admin/Roles'
import RoleForm from './Admin/RoleForm'
import UsersByRole from './Admin/UsersByRole'
import Teacher from './Teacher'
import Other from './Other'
import Nav from './Nav'

import SignInForm from './auth/SignInForm'
import SignUpForm from './auth/SignUpForm'
import SignOut from './auth/SignOut'

export const AppContext = createContext()

export default function App() {

    const [cookies] = useCookies(['token'])
    let [authenticated, setAuthenticated] = useState(cookies.token !== undefined)
    let [users, setUsers] = useState([])
    let [loggedInUser, setLoggedInUser] = useState([])
    let [roles, setRoles] = useState([])
    let [userRoles, setUserRoles] = useState([])
    let [sync, setSync] = useState(false)

    function getRoles() {
        fetch('/api/users/roles', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                setUserRoles(resp)
                setSync(false)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function hasRole(role) {
        let roleFound = false;
        userRoles.forEach(element => {
            if (element.name == role) {
                roleFound = true;
            }
        });
        return roleFound;
    }

    return (
        <AppContext.Provider value={{ authenticated, setAuthenticated, users, setUsers, roles, setRoles, userRoles, setUserRoles, setSync, hasRole, loggedInUser, setLoggedInUser, getRoles }}>
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

                            <Route path="dashboard" element={<DashCards />} ></Route>
                            <Route path="/admin" element={<Admin />}>
                                <Route path="users" element={<Users />}></Route>
                                <Route path="users/new" element={<UserForm />}></Route>
                                <Route path="users/:uid/edit" element={<UserForm />}></Route>


                                <Route path="roles" element={<Roles />}></Route>
                                <Route path="roles/new" element={<RoleForm />}></Route>
                                <Route path="roles/:rid/edit" element={<RoleForm />}></Route>
                                <Route path="usersbyrole" element={<UsersByRole />}></Route>
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



