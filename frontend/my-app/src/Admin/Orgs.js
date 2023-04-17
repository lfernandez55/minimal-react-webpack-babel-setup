import React, { useState, useContext, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { AppContext } from '../App'

import { Link, useNavigate } from 'react-router-dom'

export default function Orgs() {
    const navigate = useNavigate()
    const location = useLocation();
    let oid = null
    try {
        oid = location.state.oid
    } catch (error) {
        console.log("location not found......")
    }
    
    const [UpdateDB, setUpdateDB] = useState(false);
    let { authenticated, orgs, setOrgs } = useContext(AppContext)
    useEffect(() => {
        let url = 'api/orgsroot';
        if(oid !== null){
            url = 'api/orgshierarchy/' + oid;
        }

        fetch(url, {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    navigate("/errorapi")
                } else {
                    setOrgs(resp)
                    setUpdateDB(false)
                }
            })
            .catch((err) => {
                console.log(err.message);
                navigate("/errorapi")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateDB])

    // The following test isn't strictly needed since the apis protect things
    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }

    const showMore = (param) => {
        let url = 'api/orgshierarchy/' + param;
        fetch(url, {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    navigate("/errorapi")
                } else {
                    setOrgs(resp)
                    // setUpdateDB(false)
                }
            })
            .catch((err) => {
                console.log(err.message);
                navigate("/errorapi")
            });
    }

    const deleteMe = (param) => {
        let url = "api/orgs/" + param;
        fetch(url, {
            method: "DELETE",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                // Since the delete was successful on the backend change the UpdateDB var. 
                // Since SetEffect is watching for a change to this var, the change will
                // alert SetEffect to run again.
                setUpdateDB(true)
            })
            .catch((err) => {
                alert("An error occurred while attempting delete. Most likely you are not authorized")
            });
    }

    let prevOid = null
    let jsx = ''

    const renderIndents = (oid, parent) => {

        if (parent === null){
            console.log("parent is null")
            jsx = ''
        } else {
            if (parent._id === prevOid || parent === prevOid) {
                jsx = '--' + jsx
            }
        }
      

        prevOid = oid
        return (jsx)

    };


    return (
        <div className="react-stuff users-component">
            <h1>Orgs</h1>
            <div className="table-header">
                <Link to="/admin/orgs/new"><button className="btn btn-primary"  >Create Org</button> </Link>

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
                        orgs.map((e, i) => {
                            return (
                                <tr key={i}>
                                    <td>{e._id}</td>
                                    <td><button className="link" onClick={() => { showMore(e._id) }} >{renderIndents(e._id,e.parent)}{e.name}</button></td>
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