import React from 'react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
toast.configure()
import { AppContext } from '../App';
import { useContext } from 'react'

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
    let { setSync, setAuthenticated } = useContext(AppContext)
    let { handleSubmit, handleChange, values, errors, setFieldValue } = useFormik({
        // the spread operator below copies the movie object into a new object
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
            }).then((response) => {
                if (!response.ok) throw Error('Failed to sign in')
                return response.text()
            })
                .then((response) => {
                    toast('Successfully signed in', {
                        autoClose: 1000,
                        onClose: () => {
                            // document.location = "/dashboard"
                            console.log("ZZZZZZZZZZZZZZZZZZZZ")
                            setSync(true)
                            setAuthenticated(true)
                            navigate("/dashboard");
                        }
                    })
                }).catch((error) => {
                    toast('Failed to sign in', {
                        onClose: () => {
                            document.location = "/"
                        }
                    })
                })

        }
    }
    )

    return (
        <div className="react-stuff form">
            <form onSubmit={handleSubmit}>
                <h1>Sign Inx</h1>

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