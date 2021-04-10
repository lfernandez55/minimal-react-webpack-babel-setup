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
                        <h1>Dashboardqqq</h1>
                        <p>What would you like to do?</p>
                        <Link to="/admin"><button className="btn btn-primary"  >Use Admin Tools</button> </Link>
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
    )
}



