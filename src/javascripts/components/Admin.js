import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom'
import Users from './admin/Users'
import UserForm from './admin/UserForm'
import Roles from './admin/Roles'
import RoleForm from './admin/RoleForm'
import UsersByRole from './admin/UsersByRole'

const highLight = (param) => {
    document.getElementById('usersTab').classList.remove("active")
    document.getElementById('rolesTab').classList.remove("active")
    document.getElementById('usersbyroleTab').classList.remove("active")
    document.getElementById(param).classList.add("active")
    // if (param == "rolesTab"){
    //     document.getElementById('usersTab').classList.remove("active")
    // }else if{
    //     document.getElementById('rolesTab').classList.remove("active")
    // }
}

export default function Admin() {
    return (
        <div className="react-stuff">
            <h1>Admin Tools</h1>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link className="nav-link active" id="usersTab" aria-current="page" to="/admin/users" onClick={() => highLight('usersTab')}  >Users</Link>

                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="#">Link</a> */}
                    <Link className="nav-link " id="rolesTab" aria-current="page" to="/admin/roles" onClick={() => highLight('rolesTab')}>Roles</Link>
                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="#">Link</a> */}
                    <Link className="nav-link " id="usersbyroleTab" aria-current="page" to="/admin/usersbyrole" onClick={() => highLight('usersbyroleTab')}>Users By Role</Link>
                </li>
            </ul>
            {/* <Router> */}
            {/* <Routes>
                <Route exact path="/admin/users" element={<Users />}></Route>
                <Route exact path="/admin/users/new" element={<UserForm />}></Route>
                <Route exact path="/admin/users/:uid/edit" element={<UserForm />}></Route>
                <Route exact path="/admin/roles" element={<Roles />}></Route>
                <Route exact path="/admin/roles/new" element={<RoleForm />}></Route>
                <Route exact path="/admin/roles/:rid/edit" element={<RoleForm />}></Route>
                <Route exact path="/admin/usersbyrole" element={<UsersByRole />}></Route>
            </Routes> */}
            {/* </Router> */}
            <Outlet />
        </div>
    )
}