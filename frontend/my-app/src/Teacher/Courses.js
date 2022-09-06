import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../App'

import { Link, useNavigate } from 'react-router-dom'

export default function Users() {
    let { authenticated, courses, setCourses } = useContext(AppContext)
    const navigate = useNavigate()
    const [DBUpdated, setDBUpdated] = useState(false);

    useEffect(() => {
        fetch('api/courses', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    navigate("/errorapi")
                } else {
                    setCourses(resp)
                    setDBUpdated(false)
                }

            })
            .catch((err) => {
                console.log(err.message);
                navigate("/errorapi")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBUpdated])


    // The following test isn't strictly needed since the API is protected.
    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }

    const deleteMe = (param) => {
        let url = "api/courses/" + param;
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
                if (resp.success === false) {
                    navigate("/errorapi")
                } else {
                    setDBUpdated("changed")
                }
            })
            .catch((err) => {
                console.log(err)
                navigate("/errorapi")
            });
    }



    return (
        <div className="react-stuff users-component">
            <h1>Courses</h1>
            <div className="table-header">
                <Link to="/teacher/courses/new"><button className="btn btn-primary"  >Create Course</button> </Link>

            </div>
            <table className="table">
                <thead>
                    <tr >
                        <td>_id</td>
                        <td>Course Name</td>
                    </tr>
                </thead>
                <tbody>

                    {
                        courses.map((e, i) => {
                            return (
                                <tr key={i}>
                                    <td>{e._id}</td>
                                    <td>{e.name}</td>
                                    <td><button className="link" onClick={() => navigate(`${e._id}/edit`)}>Edit</button></td>
                                    <td><button className="link" onClick={() => { deleteMe(e._id) }} >Delete</button></td>
                                </tr>

                            )
                        })
                    }
                </tbody >
            </table >
        </div >
    )
}