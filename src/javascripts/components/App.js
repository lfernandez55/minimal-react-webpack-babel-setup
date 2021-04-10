import React from 'react'
import {Switch, Route, Link, Redirect, useHistory} from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Admin from './Admin'

export default function Main() {
    return (
        <div className="react-stuff">
            <Router>
            in app.js....
                <Switch>
                    <Route exact path="/">
                        <h1>Dashboard</h1>
                        <p>What would you like to do?</p>
                        <Link to="/admin"><button class="btn btn-primary"  >Use Admin Tools</button> </Link>
                        <Link to="/other"><button class="btn btn-primary"  >Use Other Tools</button> </Link> 
                    </Route>
                    <Route path="/admin">
                        <Admin/>
                    </Route>
                    <Route path="/other">
                        <h1>Other Toolszzzzzze</h1>
                    </Route>
                </Switch>      
            </Router>
        </div >
    )
}



