import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../App'
import { useNavigate } from 'react-router-dom'


export default function UsersByRole() {
  let { authenticated } = useContext(AppContext)
  const [UsersByRole, setUsersByRole] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    fetch('/api/roles/users', {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((resp) => {
        if (resp.success === false) {
          navigate("/errorapi")
        } else {
          setUsersByRole(resp)
        }
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/errorapi")
      });
  }, [])
  console.log(UsersByRole)

  // The following test isn't strictly needed since authentication is already checked when the user
  // requests the dashboard prior to getting here.
  // But it doesn't hurt to have the extra test in case the authentication test on the dashboard is
  // compromised.
  if (!authenticated) {
    document.location = '/signin'
    return <></>
  }





  return (
    <div className="react-stuff users-component">
      <h1>USERS BY ROLES</h1>

      {
        UsersByRole.map((r, i) => {
          let myArray = []
          myArray.push(<h3 key={i}>{r.name}</h3>)
          r.users.forEach((user, index) => {
            myArray.push(<p key={user._id}>{user.email}</p>)
          })
          return (myArray)
        })
      }
    </div >
  )
}