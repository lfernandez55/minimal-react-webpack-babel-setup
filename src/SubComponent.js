import React from 'react'
import {Switch, Route, Link, Redirect, useHistory} from 'react-router-dom'

import OtherComp from './OtherComp'
import SubOtherComp from './SubOtherComp'

export default function SubComponent() {
    return (
        <div className="sub-comp">
            <h1>Here we are in the top of the SubComponent</h1>
            <section>
                <div className="route-demo">
                    <ul>
                        <li><Link to={'/OtherComp'} >OtherComp</Link></li>
                        <li><Link to={'/Foo'} >Foo</Link></li>
                    </ul>
                </div>
                <div className="route-demo">
                    <Route path="/OtherComp">
                        <OtherComp/> 
                    </Route>
                    <Route path="/Foo">
                        <h2>This is foo content</h2>
                    </Route>
                </div>  
                <div className="route-demo">
                    <Route path="/OtherComp/SubOtherComp">
                        <SubOtherComp/>
                    </Route>
                    <Route path="/OtherComp/Baz">
                    <h2>This is baz content</h2>
                    </Route>
                </div> 

            </section>
        

            <h1>Here we are in the bottom of the SubComponent</h1>
        </div>

    )
}