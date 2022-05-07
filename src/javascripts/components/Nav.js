import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from './App';

export default function Nav() {
    let { authenticated, loggedInUser } = useContext(AppContext)
    return (
        <>
            <header>

                {authenticated ? (
                    <>
                        <div>
                            <Link to="">Home</Link> | <Link to="dashboard">Dashboard</Link>
                        </div>
                        <div>
                            {loggedInUser.email} | <Link to="signout">Logout</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <Link to="">Home</Link>
                        </div>
                        <div>
                            <Link to="signup">Register</Link> | <Link to="signin">Log in</Link>
                        </div>
                    </>
                )
                }


            </header>


            <Outlet />

            <footer>
                <h6><a href="/createAdmin">Reseed the DB with an account username: admin, password: admin</a></h6>
            </footer>
        </>
    )
}