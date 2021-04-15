import React, {useState, createContext } from 'react'
import {Switch, Route, Link, Redirect, useHistory} from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Admin from './Admin'
import {useCookies} from 'react-cookie'

export const AppContext = createContext()

export default function DashBoard() {

    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    let [authenticated, setAuthenticated] = useState(cookies.token !== undefined)
    let [users, setUsers ] = useState([])
    let [roles, setRoles ] = useState([])
    // todo here:  fetch role and add to userRole context.  use it to display or hide buttons below


    return (
        <AppContext.Provider value={{authenticated, setAuthenticated, users, setUsers, roles, setRoles}}>
        <div className="react-stuff">
            <Router>
                <Switch>
                    <Route exact path="/dashboard">
                        <h1>Dashboard</h1>
                        <p>What would you like to do?</p>
                        <Link to="/admin/users"><button className="btn btn-primary"  >Use Admin Tools</button> </Link>
                        <Link to="/other"><button className="btn btn-primary"  >Use Other Tools</button> </Link> 
                    </Route>
                    <Route path="/admin">
                        <Admin/>
                    </Route>
                    <Route path="/other">
                        <h1>Other Tools</h1>
                    </Route>
                </Switch>      
            </Router>
        </div >
        </AppContext.Provider>
    )
}

