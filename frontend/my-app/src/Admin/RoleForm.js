import React, { useContext, useState } from 'react'
import { AppContext } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
toast.configure()



export function Vhelp({ message }) {
    return (
        <p className="help">{message}</p>
    )

}

const validationSchema = yup.object({

    name: yup.string().required(),

})

export default function RoleForm() {
    const navigate = useNavigate()

    let { handleSubmit, handleChange, values, errors, setFieldValue } = useFormik({
        initialValues: is_new ? {
            firstname: "",
        } : { ...role },
        validationSchema,

        onSubmit(values) {
            fetch(`api/roles${is_new ? '' : '/' + role._id}`, {
                method: is_new ? 'POST' : "PUT",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(values)
            }).then((response) => {
                toast('Successfully submitted', {
                    autoClose: 500,
                    onClose: () => {
                        navigate("/admin/roles")
                    }
                })
            }).catch((error) => {
                toast('Failed to submit', {
                    autoClose: 500,
                    onClose: () => {
                        navigate("/admin/roles")
                    }
                })
            })

        }
    }
    )

    let { authenticated, setAuthenticated, roles, setRoles } = useContext(AppContext)

    let { rid } = useParams()

    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }

    let role = rid ? roles.find(r => r._id == rid) : {}

    let is_new = rid === undefined



    let title = ""
    if (is_new) {
        title = "Create Role"
    } else {
        title = "Edit Role"
    }



    return (
        <div className="react-stuff form">

            <form onSubmit={handleSubmit}>
                <h1>{title}</h1>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <div className="control">
                        <input type="text" name="name" value={values.name} onChange={handleChange} />
                        <Vhelp message={errors.name} />
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