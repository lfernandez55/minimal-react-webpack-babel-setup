import React from 'react'
import SubComponent from './SubComponent'
import { BrowserRouter as Router } from 'react-router-dom'

export default function Main() {
    return (
        <Router>
            <h1>In App.js</h1>
            <SubComponent />
        </Router>
    )
}