import React, { useContext, useEffect } from 'react'
import { AppContext } from '../App.jsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify'


export function Vhelp({ message, touchedField }) {
    return (<p className="help">{message}</p>)
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
    // courseid, uid and rid are defined in router, see App.js
    let { courseid } = useParams()
    let is_new = courseid === undefined

    let course = courseid ? courses.find(c => c._id === courseid) : {name:"",students:[]}
    const {register, handleSubmit, setError, formState: { errors } } = useForm({
    defaultValues: {
      name: course.name,
      enrolledStudents: course.enrolledStudents
    }
    });

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
                setError("name", {
                    type: "manual", // important for custom errors
                    message: "Course name is already used"
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

    return (
        <div className="react-stuff form">

            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>{title}</h1>
                <div className="field">
                    <label htmlFor="name">Course Name</label>
                    <div className="control">
                        <input type="text" name="name" {...register("name", { required: "Course name is required" })} />
                        {errors.name && <Vhelp message={errors.name.message}/>}
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="roles">Enrolled Students (selected)</label>
                    <div className="control">
                       
                        <select className="form-select form-select-sm" name="enrolledStudents" multiple {...register("enrolledStudents")} >
                            
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