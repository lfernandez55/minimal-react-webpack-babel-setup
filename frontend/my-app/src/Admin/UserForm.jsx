import React, { useContext } from 'react'
import { AppContext } from '../App.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify'
toast.configure()

export function Vhelp({ message, touchedField }) {
    return (<p className="help">{message}</p>)
}


export default function UserForm() {
    let { authenticated, users, roles } = useContext(AppContext)
    const navigate = useNavigate()
    let { uid } = useParams()
    let is_new = uid === undefined

    let user = uid ? users.find(u => u._id === uid) : {}
    // We set this to "dummy". If the server see's
    // this password, than it doesn't change it
    user.password = "dummy"

    const {register, handleSubmit, setError, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password,
      roles: user.roles
    }
    });

    const onSubmit = (data) =>{
        fetch(`api/users${is_new ? '' : '/' + user._id}`, {
            method: is_new ? 'POST' : "PUT",
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


    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }

    let title = ""
    if (is_new) {
        title = "Create User"
    } else {
        title = "Edit User"
    }

    return (
        <div className="react-stuff form">

            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{title}</h1>
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
                    <label htmlFor="roles">Roles</label>
                    <div className="control">
                        <select className="form-select form-select-sm" name="roles" multiple {...register("roles")} > 
                            {
                                roles.map((e, i) => {
                                    return (<option key={i} value={e._id} >{e.name}</option>)
                                })
                            }
                        </select>

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