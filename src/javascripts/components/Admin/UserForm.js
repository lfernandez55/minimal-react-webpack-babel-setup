import React, { useContext, useState } from 'react'
import { AppContext } from '../DashBoard'
import { useHistory, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
toast.configure()

export function Vhelp({message}){
    return(
        <p className="help">{message}</p>
    )

}

const validationSchema = yup.object({

    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required()
})

export default function UserForm(){
    let { authenticated, setAuthenticated, users, setUsers} = useContext(AppContext)

    let {uid} = useParams()

    if(!authenticated){
        document.location = '/signin'
        return <></>
    }

    const history = useHistory()

    console.log(uid)
    console.log(users)
    let user = uid ? users.find(u => u._id == uid) : {}
    // we set this to "dummy" if the server see's
    // this password than it doesn't change it
    user.password = "dummy"
    console.log(user)

    let is_new = uid === undefined

    let {handleSubmit, handleChange, values, errors, setFieldValue } = useFormik({
        initialValues: is_new? {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "asdf"
        } : {...user},
        validationSchema,

        onSubmit(values){
            console.log("IN FETCH...........................")
            fetch(`api/users${is_new ? '' : '/' + user._id}`, {
                method: is_new ? 'POST' :"PUT",
                headers: {'Content-Type':'application/json'},
                credentials: 'same-origin',
                body:  JSON.stringify(values)
            }).then((response) => {
                    toast('Successfully submitted', {
                        autoClose: 500,
                        onClose: () =>{
                            //document.location = "admin/users"
                            history.push("/admin/users")
                        }
                    })
            }).catch((error)=>{
                toast('Failed to submit', {
                    autoClose: 500,
                    onClose: () =>{
                        //document.location = "admin/users"
                        history.push("/admin/users")
                    }
                })
            })

        }
    }
    )

    let title = ""
    if (is_new){
        title = "Create Userx"
    }else{
        title = "Edit Userx"
    }



    return(
            <div className="react-stuff form">
                
            <form onSubmit={handleSubmit}>
               <h1>{title}</h1>
               <div className="field">
                <label htmlFor="firstName">First Name</label>
                <div className="control">
                    <input type="text" name="firstName" value={values.firstName} onChange={ handleChange }    />
                    <Vhelp message={errors.firstName}/>
                </div>
               </div>

               <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <div className="control">
                    <input type="text" name="lastName" value={values.lastName} onChange={ handleChange }    />
                    <Vhelp message={errors.lastName}/>
                </div>
               </div>

               <div className="field">
                <label htmlFor="email">Email</label>
                <div className="control">
                    <input type="text" name="email" value={values.email} onChange={ handleChange  }    />
                    <Vhelp message={errors.email}/>
                </div>
               </div>

               <div className="field">
                <label htmlFor="username">Username</label>
                <div className="control">
                    <input type="text" name="username" value={values.username} onChange={ handleChange }    />
                    <Vhelp message={errors.username}/>
                </div>
               </div>

               <div className="field">
                <label htmlFor="password">Password</label>
                <div className="control">
                    <input type="password" name="password" value={values.password} onChange={ handleChange }    />
                    <Vhelp message={errors.password}/>
                </div>
               </div>

               <div className="field">
                <label ></label>
                <div className="control">
                    <button className="btn btn-primary" type="submit">Submit</button>
                    <button className="btn btn-primary" onClick={() => document.location="/" }>Cancel</button>
                </div>
               </div>


           </form>
           </div>
    )


}