import React, { useContext, useEffect } from 'react'
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



export default function CourseForm() {
    let { authenticated, courses, students, setStudents } = useContext(AppContext)


    useEffect(() => {
        fetch('/api/students', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    navigate("/errorapi")
                } else {
                    setStudents(resp)
                    
                }

            })
            .catch((err) => {
                console.log(err.message);
                navigate("/errorapi")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const navigate = useNavigate()
    let { courseid } = useParams()
    let is_new = courseid === undefined

    let course = courseid ? courses.find(c => c._id === courseid) : {}

    const initialValues = is_new ? {courseName: "",users: [] } : { ...course }
    const validationSchema = yup.object({
        name: yup.string().required()
    })
    const onSubmit = (values) =>{
        fetch(`api/courses${is_new ? '' : '/' + course._id}`, {
            method: is_new ? 'POST' : "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(values)
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.success === false && response.errorCode === 11000) {
                toast(response.message, {
                    autoClose: 5000,
                })
                formik.setFieldError('coursename', 'Coursename is already used');
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
                        navigate("/teacher/courses")
                    }
                })
            }
        }).catch((error) => {
            console.log(error)
            toast("Course create/edit failed", {
                onClose: () => {
                    navigate("/errorapi")
                }
            })
        })
    }
    let formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    })

    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }

    let title = ""
    if (is_new) {
        title = "Create Course"
    } else {
        title = "Edit Course"
    }
    console.log("DEBUG formik.getFieldProps.", formik.getFieldProps('enrolledStudents').value)
    return (
        <div className="react-stuff form">

            <form onSubmit={formik.handleSubmit}>
                <h1>{title}</h1>
                <div className="field">
                    <label htmlFor="name">Course Name</label>
                    <div className="control">
                        <input type="text" {...formik.getFieldProps('name')} />
                        <Vhelp message={formik.errors.name} touchedField={formik.touched.name} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="roles">Enrolled Students</label>
                    <div className="control">
                        {/* <select className="form-select form-select-sm" name="enrolledStudents" multiple value={[ "6313c7fd057564570c9aaad1", "6317873d3d4e21413465a276" ]} onChange={formik.handleChange} > */}
                        <select className="form-select form-select-sm" name="enrolledStudents" multiple value={formik.getFieldProps('enrolledStudents').value} onChange={formik.handleChange} >
                            
                            {
                                students.map((e, i) => {
                                    return (<option key={i} value={e._id} >{e.firstName} {e.lastName}</option>)
                                })
                            }
                        </select>

                    </div>
                </div>


                <div className="field">
                    <label ></label>
                    <div className="control">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-primary" onClick={() => navigate("/teacher/courses")}>Cancel</button>
                    </div>
                </div>


            </form>
        </div>
    )


}