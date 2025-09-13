import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App.jsx';
import { useContext } from 'react'

export function Vhelp({ message }) {
    return (
        <p className="help">{message}</p>
    )

}


export default function SignInForm() {
    const [data, setData] = useState("");
    const {register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    let { setAuthenticated, setLoggedInUser } = useContext(AppContext)

    const onSubmit = (data) =>{
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
                        autoClose: 1000,
                        onClose: () => {
                            setLoggedInUser(response.user)
                            // without setAuthenticated("true") "Login" link wouldn't disappear from nav
                            setAuthenticated(true)
                            navigate("/dashboard");
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

    return (
        <div className="react-stuff form">
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Sign In</h1>

                <div className="field">
                    <label htmlFor="username">Username</label>
                    <div className="control">
                        <input type="text" name="username" {...register("username", { required: "Username is required" })}/>
                        {errors.username && <Vhelp message={errors.username.message}/>}
                    </div>
                </div>

                 <div className="field">
                     <label htmlFor="password">Password</label>
                     <div className="control">
                         <input type="password" name="password" {...register("password", { required: "Password is required" })}/>
                         {errors.password && <Vhelp message={errors.password.message}/>}
                     </div>
                 </div>

                <div className="field">
                    <label ></label>
                    <div className="control">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-primary" onClick={() => document.location = "/"}>Cancel</button>
                    </div>
                </div>


            </form>
        </div>
    )


}