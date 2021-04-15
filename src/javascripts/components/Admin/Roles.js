import React, {useState, useContext, useEffect} from 'react'
import { AppContext } from '../DashBoard'

import { Switch, Route, Link, Redirect, useHistory } from 'react-router-dom'

export default function Users() {
    let { authenticated, setAuthenticated, roles, setRoles} = useContext(AppContext)
    // The following test isn't strictly needed since authentication is already checked when the user
    // requests the dashboard prior to getting here.
    // But it doesn't hurt to have the extra test in case the authentication test on the dashboard is
    // compromised.
    if(!authenticated){
        document.location = '/signin'
        return <></>
    }
    console.log("in roles!")
    let history = useHistory();

    const [DBUpdated, setDBUpdated] = useState(false);
    
      const deleteMe = (param) => {
        let url = "api/roles/" + param;
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
                // Code called when an error occurs during the request
                console.log(' xxxxx ', err.message);
                alert("An error occurred while attempting delete. Most likely you are not authorzed")
            });
    }
    
      useEffect(() => {
        fetch('api/roles', {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((resp) => {
            console.log('something is returned....');
            console.log(resp)
            setRoles(resp)
            console.log(users)
            setDBUpdated(false)
          })
          .catch((err) => {
            // Code called when an error occurs during the request
            console.log(err.message);
          });
      }, [DBUpdated])


    return (
        <div className="react-stuff users-component">
            <h1>Roles</h1>
            <div className="table-header">
                <Link to="/admin/roles/new"><button className="btn btn-primary"  >Create Role</button> </Link>

            </div>
            <table className="table">
                <thead>
                <tr >
                        <td>_id</td>
                        <td>Name</td>
                        <td>Edit</td>
                        <td>Delete</td>
                    </tr>
                </thead>
                <tbody>

                    {
                        roles.map( (e,i) => {
                            return (
                                <tr key={i}>
                                    <td>{e._id}</td>
                                    <td>{e.name}</td>
                                    <td><a className="link" onClick={() => history.push(`roles/${e._id}/edit`)}>Edit</a></td>
                                    <td><a className="link" onClick={()=>{ deleteMe(e._id) }} >Delete</a></td>
                                </tr>
        
                            )
                        })
                    }
                </tbody >
            </table >
        </div >
    )
}