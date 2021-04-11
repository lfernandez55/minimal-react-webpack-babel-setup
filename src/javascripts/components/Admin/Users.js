import React, {useState, createContext, useEffect} from 'react'
import { Switch, Route, Link, Redirect, useHistory } from 'react-router-dom'

export default function Users() {

    // useEffect(() => {
        // if(!movies){
    //     fetch('/api/users', {credentials: 'same-origin'})
    //     .then(response => {
    //       console.log("DEBUG IN api/users fetch")
    //       return response.text();
    //     } 
    //       )
    //     .then((data) => {
    //       console.log('debug in data')
    //       console.log(data)
    //     //   setMovies(JSON.parse(data, (key, value) => {
    //     //     const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:.*Z$/
    //     //     if(typeof value === 'string' && dateFormat.test(value)){
    //     //       return new Date(value)
    //     //     }
    //     //     return value
    //     //   } ))
    //     }
    //     )
    //     .catch(console.error)
    //   // the following array par stops fetch from being called constanly
    //   // but instead of using this Abdulmalek uses if(!movies)
    //   // },[])
    //   //   }
    //   })
      const [users, setUsers] = useState([]);
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
                // Code called when an error occurs during the request
                console.log(' xxxxx ', err.message);
                alert("An error occurred while attempting delete. Most likely you are not authorzed")
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
            console.log('something is returned....');
            console.log(resp)
            setUsers(resp)
            console.log(users)
            setDBUpdated(false)
          })
          .catch((err) => {
            // Code called when an error occurs during the request
            console.log(err.message);
          });
      }, [DBUpdated])


    return (
        <div className="react-stuff">
            <h1>Users</h1>
            <div className="table-header">
                <Link to="/admin/userform"><button className="btn btn-primary"  >Create User</button> </Link>

            </div>
            <table className="table">
                <thead>
                <tr >
                        <td>_id</td>
                        <td>fname</td>
                        <td>laname</td>
                        <td>username</td>
                        <td>email</td>
                        <td>roles</td>
                        <td>edit</td>
                        <td>delete</td>
                    </tr>
                </thead>
                <tbody>

                    {
                        users.map( (e,i) => {
                            return (
                                <tr key={i}>
                                    <td>{e._id}</td>
                                    <td>{e.firstname}</td>
                                    <td>{e.lastname}</td>
                                    <td>{e.username}</td>
                                    <td>{e.email}</td>
                                    <td>roles</td>
                                    <td><button className="primary" onClick={() => history.push(`/project/${e._id}`)}>Edit</button>    </td>
                                    <td> <a className="link" onClick={()=>{ deleteMe(e._id) }} >Delete</a>  </td>
                                </tr>
        
                            )
                        })
                    }
                </tbody >
            </table >
        </div >
    )
}