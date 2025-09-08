import React, { useContext } from 'react'
import { AppContext } from '../App.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify'


export function Vhelp({ message, touchedField }) {
    return (<p className="help">{message}</p>)
}


export default function UserForm() {
    let { authenticated, users, roles } = useContext(AppContext)
    const navigate = useNavigate()
 

    const {register, handleSubmit, setError, formState: { errors } } = useForm({
    });

    const onSubmit = (data) =>{
        fetch('api/users/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.success === false && response.errorCode === 11000) {
                toast(response.message, {
                    autoClose: 5000,
                })
                setError("username", {
                    type: "manual", // important for custom errors
                    message: "Username is already used"
                });
            } else if (response.success === false){
                toast(response.message, {
                    autoClose: 5000,
                    onClose: () => {
                        navigate("/errorapi")
                    }
                })
            }
            else{
                toast(response.message, {
                    autoClose: 1000,
                    onClose: () => {
                        navigate("/admin/users")
                    }
                })
            }
        }).catch((error) => {
            console.log(error)
            toast("User create/edit failed", {
                onClose: () => {
                    navigate("/errorapi")
                }
            })
        })
    }



    return (
        <div className="react-stuff form">

            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Sign Up</h1>
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <div className="control">
                        <input type="text" name="firstName" {...register("firstName", { required: "First name is required" })} />
                        {errors.firstName && <Vhelp message={errors.firstName.message}/>}
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="control">
                        <input type="text" name="lastName" {...register("lastName", { required: "Last name is required" })} />
                        {errors.lastName && <Vhelp message={errors.lastName.message}/>}
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <div className="control">
                        <input type="text" name="email"           {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                            },
                        })} />
                        {errors.email && <Vhelp message={errors.email.message}/>}

                    </div>
                </div>

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
                        <button className="btn btn-primary" onClick={() => navigate("/admin/users")}>Cancel</button>
                    </div>
                </div>


            </form>
        </div>
    )


}
