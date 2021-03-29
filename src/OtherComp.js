import React from 'react'
import {Switch, Route, Link, Redirect, useHistory} from 'react-router-dom'


export default function OtherComp() {
    return (
        <div className="other-comp">
            <h2>Here we are in OtherComp</h2>
            <div className="route-demo">
                <ul>
                    <li><Link to={'/OtherComp/SubOtherComp'} >SubOtherComp</Link></li>
                    <li><Link to={'/OtherComp/Baz'} >Baz</Link></li>
                </ul>
            </div>
        </div>
    )
}