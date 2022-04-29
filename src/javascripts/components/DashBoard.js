import React, { useState, createContext, useEffect } from 'react'
import { Routes, Route, Link, Outlet } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Admin from './Admin'
import { useCookies } from 'react-cookie'
import DashCards from './admin/DashCards'
import Users from './admin/Users'
import UserForm from './admin/UserForm'
import Roles from './admin/Roles'
import RoleForm from './admin/RoleForm'
import UsersByRole from './admin/UsersByRole'
import Teacher from './Teacher'
import Other from './Other'

export const AppContext = createContext()

export default function DashBoard() {

    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    let [authenticated, setAuthenticated] = useState(cookies.token !== undefined)
    let [users, setUsers] = useState([])
    let [roles, setRoles] = useState([])
    let [userRoles, setuserRoles] = useState([])

    useEffect(() => {
        fetch('/api/users/roles', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                setuserRoles(resp)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [])

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
        <AppContext.Provider value={{ authenticated, setAuthenticated, users, setUsers, roles, setRoles, userRoles, hasRole }}>
            <div className="react-stuff">
                <Router>
                    <Routes>
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
                    </Routes>
                </Router>
                <Outlet />
            </div >
        </AppContext.Provider >
    )
}

