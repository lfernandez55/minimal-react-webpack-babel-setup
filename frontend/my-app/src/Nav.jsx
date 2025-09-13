import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from './App.jsx';


export default function Nav() {
    let { authenticated, loggedInUser } = useContext(AppContext)

        const removePassportSession = () =>{
            
            fetch('api/users/signout', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                // following line instructs browser to send the token along with every request:
                credentials: 'same-origin',
                body: JSON.stringify(),
            })
                .then((response) => {
                    // if (!response.ok) throw Error('Failed to sign in')
                    console.log(response)
                    return response.json()
                })
                .then((response) => {
                    console.log(response.message)
                }).catch((error) => {
                    console.log(error)
                })
    
    }

    function seedDB() {
        fetch('/api/createAdmin', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    alert("An error occurred")
                } else {
                    alert("DB Seeded!")
                }

            })
            .catch((err) => {
                alert("An error occurred", err)
            });
    }

    function deleteCookie() {
        alert("Deleting passport session - in Chrome dev tools, right click on cookie and click refresh to see it removed)")
    }
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
                <h6 className="link" style={{ color: 'blue' }} onClick={seedDB}>Reseed the DB with an account username: admin, password: asdf</h6>
                <h6 className="link" style={{ color: 'blue' }} onClick={removePassportSession}>Delete Session Cookie</h6>
            </footer>
        </>
    )
}