import React, { useContext } from 'react'
import { AppContext } from '../App.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify'
toast.configure()



export function Vhelp({ message }) {
    return (
        <p className="help">{message}</p>
    )

}

export default function RoleForm() {
    const [data, setData] = useState("");

    
    const navigate = useNavigate()

    let { rid } = useParams()
    let is_new = rid === undefined

    let { authenticated, roles } = useContext(AppContext)
    
    let role = rid ? roles.find(r => r._id === rid) : {name:""}
    const {register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: role.name
    }
    });

    // let { rid } = useParams()
    // let is_new = rid === undefined
    // let { authenticated, roles } = useContext(AppContext)
    // let role = rid ? roles.find(r => r._id === rid) : {}
    // console.log("xxxx", role)
    // let initialValue;
    // is_new ? initialValue= "" : initialValue = {...role}.name
    // const {register, handleSubmit, formState: { errors } } = useForm({
    // defaultValues: {
    //   name: initialValue
    // }
    // });



    const onSubmit = (data) =>{
        setData(data)
        fetch(`api/roles${is_new ? '' : '/' + role._id}`, {
            method: is_new ? 'POST' : "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.success === false) {
                navigate("/errorapi")
            } else {
                toast(response.message, {
                    autoClose: 3000,
                    onClose: () => {
                        navigate("/admin/roles")
                    }
                })
            }

        }).catch((error) => {
            toast('Failed to submit', {
                autoClose: 500,
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
        title = "Create Role"
    } else {
        title = "Edit Role"
    }



    return (
        <div className="react-stuff form">

            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{title}</h1>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <div className="control">
                        {/* <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.name} /> */}
                        <input type="text" name="name" {...register("name", { required: "Role name is required" })} />
                        {errors.name && <Vhelp message={errors.name.message}/>}
                    </div>
                </div>



                <div className="field">
                    <label ></label>
                    <div className="control">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-primary" onClick={() => navigate("/admin/roles")}>Cancel</button>
                    </div>
                </div>


            </form>
        </div>
    )


}