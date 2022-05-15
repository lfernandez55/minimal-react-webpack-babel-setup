import React from 'react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App';
import { useContext } from 'react'
toast.configure()

export function Vhelp({ message }) {
    return (
        <p className="help">{message}</p>
    )

}

const validationSchema = yup.object({

    username: yup.string().required(),
    password: yup.string().required(),
})

export default function SignInForm() {
    const navigate = useNavigate();
    let { getRoles, setAuthenticated, setLoggedInUser } = useContext(AppContext)
    let { handleSubmit, handleChange, values, errors } = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema,

        onSubmit(values) {
            fetch('api/users/signin', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                // following line instructs the browser to send the token along with every request:
                credentials: 'same-origin',
                body: JSON.stringify(values),
            })
                .then((response) => {
                    console.log(response)
                    // if (!response.ok) throw Error('Failed to sign in')
                    //return response.text()
                    return response.json()
                })
                .then((response) => {
                    console.log("In signinform")
                    console.log(response.user.roles[0].name)
                    if (response.success === true) {
                        toast('Successfully signed in', {
                            autoClose: 1000,
                            onClose: () => {
                                // let myRespObj = JSON.parse(response);
                                setLoggedInUser(response.user)
                                //getRoles()
                                setAuthenticated(true)
                                navigate("/dashboard");
                            }
                        })
                    } else if (response.success === false && response.message === 'nouser') {
                        toast('Unsuccessful sign in.  Most likely your username and password do not match', {
                            autoClose: 3000
                        })
                    } else if (response.success === false) {
                        navigate("/errorapi")
                    }
                    console.log(response)

                }).catch((error) => {
                    toast('An unknown error occurred during sign in', {
                        onClose: () => {
                            navigate("/errorapi")
                        }
                    })
                })

        }
    }
    )

    return (
        <div className="react-stuff form">
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>

                <div className="field">
                    <label htmlFor="username">Username</label>
                    <div className="control">
                        <input type="text" name="username" value={values.username} onChange={handleChange} />
                        <Vhelp message={errors.username} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="control">
                        <input type="password" name="password" value={values.password} onChange={handleChange} />
                        <Vhelp message={errors.password} />
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