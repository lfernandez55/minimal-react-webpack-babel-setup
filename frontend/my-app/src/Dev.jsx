import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AppContext } from './App.jsx';
import { useContext } from 'react'

export function Vhelp({ message }) {
    return (
        <p className="help">{message}</p>
    )

}

//111 This Component should be deleted when you submit the first assignment.  It's here
//just to get you started with the final project

export default function Dev() {
    const [data, setData] = useState("");
    const {register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    let { setAuthenticated, authenticated, setProfile, profile } = useContext(AppContext)

    const stubOnSignIn = (data) =>{
        setData(data);
        fetch('api/users/signin', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            // following line instructs browser to send the token along with every request:
            credentials: 'same-origin',
            body: JSON.stringify(data),
        })
            .then((response) => {
                // if (!response.ok) throw Error('Failed to sign in')
                console.log(response)
                return response.json()
            })
            .then((response) => {
                if (response.success === true) {
                    toast(response.message, {
                        autoClose: 500,
                        onClose: () => {
                            setProfile(response.user)
                            setAuthenticated(true)
                            //navigate("/dashboard");
                        }
                    })
                } else {
                    toast(response.message, {
                        autoClose: 3000
                    })
                } 
            }).catch((error) => {
                toast('An unknown error occurred during sign in', {
                    onClose: () => {
                        navigate("/errorapi")
                    }
                })
            })

    }
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
                    setAuthenticated(false)
                    console.log(response)
                }).catch((error) => {
                    console.log(error)
                })
    
    }
    return (
        <div >
            <div >
            <button onClick={()=>stubOnSignIn({username:"admin",password:"asdf"})}>Stub SignIn Admin</button>
            <button onClick={()=>stubOnSignIn({username:"peter",password:"asdf"})}>Stub SignIn Peter</button>
            <button onClick={removePassportSession}>Stub SignOut</button>
            </div>
            <div ><button onClick={()=>navigate("/dashboard")}>Navigate to DashCard Page</button></div>
            <div>Authenticated: {JSON.stringify(authenticated, null, 2)}</div>
            <div >Profile: <pre>{JSON.stringify(profile, null, 2)}</pre></div>
            
        </div>
    )


}