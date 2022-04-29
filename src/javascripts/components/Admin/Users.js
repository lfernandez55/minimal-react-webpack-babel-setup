import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../DashBoard'

import { Link, useNavigate } from 'react-router-dom'

export default function Users() {
    let { authenticated, setAuthenticated, users, setUsers, roles, setRoles } = useContext(AppContext)
    // The following test isn't strictly needed since authentication is already checked when the user
    // requests the dashboard prior to getting here.
    // But it doesn't hurt to have the extra test in case the authentication test on the dashboard is
    // compromised.
    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }

    const navigate = useNavigate()
    // the below used to be used.  setting this instead in dashboard and sharing via context
    //const [users, setUsers] = useState([]);
    const [DBUpdated, setDBUpdated] = useState(false);

    const deleteMe = (param) => {
        let url = "api/users/" + param;
        fetch(url, {
            method: "DELETE",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                // Since the delete was successful on the backend change the DBUpdated var. 
                // Since SetEffect is watching for a change to this var, the change will
                // alert SetEffect to run again.
                setDBUpdated("changed")
            })
            .catch((err) => {
                alert("An error occurred while attempting delete. Most likely you are not authorized")
            });
    }

    useEffect(() => {
        fetch('api/users', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                setUsers(resp)
                setDBUpdated(false)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [DBUpdated])

    useEffect(() => {
        fetch('api/roles', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                setRoles(resp)
                setDBUpdated(false)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [DBUpdated])

    return (
        <div className="react-stuff users-component">
            <h1>Users</h1>
            <div className="table-header">
                <Link to="/admin/users/new"><button className="btn btn-primary"  >Create User</button> </Link>

            </div>
            <table className="table">
                <thead>
                    <tr >
                        <td>_id</td>
                        <td>First Name</td>
                        <td>Last name</td>
                        <td>Username</td>
                        <td>Email</td>
                        <td>Roles</td>
                        <td>Edit</td>
                        <td>Delete</td>
                    </tr>
                </thead>
                <tbody>

                    {
                        users.map((e, i) => {
                            return (
                                <tr key={i}>
                                    <td>{e._id}</td>
                                    <td>{e.firstName}</td>
                                    <td>{e.lastName}</td>
                                    <td>{e.username}</td>
                                    <td>{e.email}</td>
                                    <td>
                                        {
                                            roles.map((r, i) => {
                                                const found = e.roles.find(element => element == r._id);
                                                if (found) {
                                                    return (r.name + ", ")
                                                }
                                            })
                                        }


                                    </td>
                                    <td><a className="link" onClick={() => navigate(`${e._id}/edit`)}>Edit</a></td>
                                    <td><a className="link" onClick={() => { deleteMe(e._id) }} >Delete</a></td>
                                </tr>

                            )
                        })
                    }
                </tbody >
            </table >
        </div >
    )
}