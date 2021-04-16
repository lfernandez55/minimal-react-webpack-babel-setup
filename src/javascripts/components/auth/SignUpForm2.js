// TODO:  Code an alternate to SignUpForm without using Formic

import React from 'react'
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
    password: yup.string().required(),
})

export default function SignUpForm(){

    function dev(){
        values.firstName= "aa",
        values.lastName= "aa",
        values.email= "aa@aa.edu",
        values.username= "aa",
        values.password= "aa"
    }

    function createFormObj(form){
        let formObj = new Object();
        formObj.firstName= form.firstName.value,
        formObj.lastName= form.lastName.value,
        formObj.email= form.email.value,
        formObj.username= form.username.value,
        formObj.password= form.password.value
        return formObj
    }
    function validateForm(event){
        let valid = true;
        if (event.target.username.value == ""){
            errors.username = "Username required"
            valid = false;
        }
        if (valid){
            return true;
        }else{
            return false;
        }
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + event.target.username.value);
        let validated = validateForm(event)
        if (validated){

        }else{
            event.preventDefault();
        }
        
    }

    function submitForm (values){
            fetch('api/users/register', {
                method: "POST",
                headers: {'Content-Type':'application/json'},
                // following line instructs the browser to send the token along with every request:
                credentials: 'same-origin',
                body:  JSON.stringify(values),
            }).then((response) => {
                // response.ok checks to see if the response is in the 200 to 300 range
                // Duplicate account violations are NOT returning 200 range errors by design.
                // Instead the dupe problem is sent in the response.message and displayed in the toast 
                if(!response.ok) throw Error(response)
                return response.json()
            }).then((response) => {
                    console.log('debug1')
                    console.log(response.errorCode)
                    if (response.errorCode == 11000){
                        console.log("debug2")
                        // toast(response.message, {
                        //     autoClose: 3000,
                        //     onClose: () =>{
                        //         document.location = "/"
                        //     }
                        // })
                        // errors.email = "Duplicate Email";
                        values.userName = ""
                        errors.username = "Duplicate Username";
                        return errors;
                    } else {
                        toast(response.message, {
                            autoClose: 3000,
                            onClose: () =>{
                                document.location = "/"
                            }
                        })
                    }
            }).catch((error)=>{
                toast("Sign up failed", {
                    onClose: () =>{
                        document.location = "/"
                    }
                })
            })

        }

    }   
    return(
            <div className="react-stuff form">
            <form onSubmit={handleSubmit}>
               <h1>Sign Up</h1>
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
                    <button className="btn btn-primary" onClick={ dev }>Dev</button>
                </div>
               </div>


           </form>
           </div>
    )


}