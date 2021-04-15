import React from 'react'
import { Switch, Route, Link, Redirect, useHistory } from 'react-router-dom'
import Users from './admin/Users'
import UserForm from './admin/UserForm'
import Roles from './admin/Roles'
import RoleForm from './admin/RoleForm'

const highLight = (param) => {

    document.getElementById(param).classList.add("active")
    if (param == "rolesTab"){
        document.getElementById('usersTab').classList.remove("active")
    }else{
        document.getElementById('rolesTab').classList.remove("active")
    }
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
                    <Link className="nav-link " id="rolesTab"  aria-current="page" to="/admin/roles" onClick={() => highLight('rolesTab')}>Roles</Link>
                </li>
            </ul>
            <Switch>
                <Route exact path="/admin/users">
                    <Users />
                </Route>
                <Route exact path="/admin/users/new">
                    <UserForm />
                </Route>
                <Route exact path="/admin/users/:uid/edit">
                    <UserForm />
                </Route>
                <Route exact path="/admin/roles">
                    <Roles />
                </Route>
                <Route exact path="/admin/roles/new">
                    <RoleForm />
                </Route>
                <Route exact path="/admin/roles/:rid/edit">
                    <RoleForm />
                </Route>
            </Switch>
        </div>
    )
}