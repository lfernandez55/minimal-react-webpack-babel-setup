import React, { useContext, useState } from 'react'
import { AppContext } from '../DashBoard'
import { useHistory, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
toast.configure()

// export function Vhelp({message}){

//         return( <p className="help">{message}</p> )
// }

export function Vhelp({message, touchedField}){
    // console.log("Message:", (typeof message) )
    // console.log("MYtouchedField:", (typeof touchedField) )
    if (touchedField){
        return( <p className="help">{message}</p> )
    }else{
        return( <p className="help"></p> )
    }


}

const validationSchema = yup.object({

    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required()
})

export default function UserForm(){
    let { authenticated, setAuthenticated, users, setUsers, roles} = useContext(AppContext)

    let {uid} = useParams()

    if(!authenticated){
        document.location = '/signin'
        return <></>
    }

    const history = useHistory()


    let user = uid ? users.find(u => u._id == uid) : {}
    // We set this to "dummy". If the server see's
    // this password, than it doesn't change it
    user.password = "dummy"

    let is_new = uid === undefined

    let {handleSubmit, handleChange, values, errors, setFieldError, handleBlur, touched, getFieldProps  } = useFormik({
        initialValues: is_new? {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            roles: []
        } : {...user},
        validationSchema,

        onSubmit(values){
            fetch(`api/users${is_new ? '' : '/' + user._id}`, {
                method: is_new ? 'POST' :"PUT",
                headers: {'Content-Type':'application/json'},
                credentials: 'same-origin',
                body:  JSON.stringify(values)
            }).then((response) => {
                // response.ok checks to see if the response is in the 200 to 300 range
                // Duplicate account violations are NOT returning 200 range errors by design.
                // Instead the dupe problem is sent in the response.message and displayed in the toast 
                if(!response.ok) throw Error(response)
                return response.json()
            }).then((response) => {
                    if (response.errorCode == 11000){
                        toast(response.message, {
                            autoClose: 15000,
                        })
                        setFieldError('username', 'Username is already used');
                        setFieldError('email', 'Email is already used');
                    } else {
                        toast(response.message, {
                            autoClose: 1000,
                            onClose: () =>{
                                history.push("/admin/users")
                            }
                        })
                    }
            }).catch((error)=>{
                toast("Sign up failed", {
                    onClose: () =>{
                        history.push("/admin/users")
                    }
                })
            })




        }
    }
    )

    let title = ""
    if (is_new){
        title = "Create User"
    }else{
        title = "Edit User"
    }
    console.log("AAAAAAAAAAAAAAAAAAAA")
    console.log(touched)
    console.log(errors.email)
    console.log(touched.email)
    console.log("BBBBBBBBBBBBBBBBBBBB")
    return(
            <div className="react-stuff form">
                
            <form onSubmit={handleSubmit}>
               <h1>{title}</h1>
               <div className="field">
                <label htmlFor="firstName">First Name</label>
                <div className="control">
                    <input type="text" {...getFieldProps('firstName')}  />
                    <Vhelp message={errors.firstName} touchedField={touched.firstName} />
                </div>
               </div>

               <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <div className="control">
                    <input type="text" {...getFieldProps('lastName')}   />
                    
                    <Vhelp message={errors.lastName} touchedField={touched.lastName} />
                </div>
               </div>

               <div className="field">
                <label htmlFor="email">Email</label>
                <div className="control">
                    <input type="text" {...getFieldProps('email')}   />
                        
                    <Vhelp message={errors.email} touchedField={touched.email} />
                     
                </div>
               </div>

               <div className="field">
                <label htmlFor="username">Username</label>
                <div className="control">
                    <input type="text"  {...getFieldProps('username')}    />
                    <Vhelp message={errors.username} touchedField={touched.username} />
                </div>
               </div>

               <div className="field">
                <label htmlFor="password">Password</label>
                <div className="control">
                    <input type="password" {...getFieldProps('password')}   />
                    <Vhelp message={errors.password} touchedField={touched.password}  />
                </div>
               </div>

               <div className="field">
                <label htmlFor="roles">Roles</label>
                <div className="control">
                    <select class="form-select form-select-sm"  name="roles" multiple value={values.roles} onChange={ handleChange } >
                    {
                        roles.map( (e,i) => {
                            return ( <option  key={i} value={e._id} >{e.name}</option> )
                        })
                    }
                    </select>
                    
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