import React, { useContext } from 'react'
import { AppContext } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
toast.configure()

export function Vhelp({ message, touchedField }) {
    if (touchedField) {
        return (<p className="help">{message}</p>)
    } else {
        return (<p className="help"></p>)
    }


}

const validationSchema = yup.object({

    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required()
})

export default function UserForm() {
    let { authenticated, users, roles } = useContext(AppContext)
    const navigate = useNavigate()
    let { uid } = useParams()
    let is_new = uid === undefined

    let user = uid ? users.find(u => u._id === uid) : {}
    // We set this to "dummy". If the server see's
    // this password, than it doesn't change it
    user.password = "dummy"


    let { handleSubmit, handleChange, values, errors, setFieldError, touched, getFieldProps } = useFormik({
        initialValues: is_new ? {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            roles: []
        } : { ...user },
        validationSchema,

        onSubmit(values) {
            fetch(`api/users${is_new ? '' : '/' + user._id}`, {
                method: is_new ? 'POST' : "PUT",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify(values)
            }).then((response) => {
                // response.ok checks to see if the response is in the 200 to 300 range
                // Duplicate account violations by design return response.ok. 
                // Instead the dupe problem is sent in the response.message and displayed in the toast 
                // if (!response.ok) throw Error(response)
                return response.json()
            }).then((response) => {
                if (response.success === false && response.errorCode === 11000) {
                    toast(response.message, {
                        autoClose: 5000,
                    })
                    setFieldError('username', 'Username is already used');
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
    }
    )

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

            <form onSubmit={handleSubmit}>
                <h1>{title}</h1>
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <div className="control">
                        <input type="text" {...getFieldProps('firstName')} />
                        <Vhelp message={errors.firstName} touchedField={touched.firstName} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="control">
                        <input type="text" {...getFieldProps('lastName')} />

                        <Vhelp message={errors.lastName} touchedField={touched.lastName} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <div className="control">
                        <input type="text" {...getFieldProps('email')} />

                        <Vhelp message={errors.email} touchedField={touched.email} />

                    </div>
                </div>

                <div className="field">
                    <label htmlFor="username">Username</label>
                    <div className="control">
                        <input type="text"  {...getFieldProps('username')} />
                        <Vhelp message={errors.username} touchedField={touched.username} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="control">
                        <input type="password" {...getFieldProps('password')} />
                        <Vhelp message={errors.password} touchedField={touched.password} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="roles">Roles</label>
                    <div className="control">
                        <select className="form-select form-select-sm" name="roles" multiple value={values.roles} onChange={handleChange} >
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