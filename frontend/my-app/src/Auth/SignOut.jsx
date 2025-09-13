import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../App.jsx';
import { toast } from 'react-toastify'


export default function SignOut() {

    const removePassportSession = () =>{
            
            fetch('api/users/signout', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                // following line instructs browser to send the token along with every request:
                credentials: 'same-origin',
                body: JSON.stringify(),
            })
                .then((response) => {
                    // if (!response.ok) throw Error('Failed to sign in')
                    console.log(response)
                    return response.json()
                })
                .then((response) => {
                    console.log(response.message)
                }).catch((error) => {
                    toast('An unknown error occurred during sign out', {
                        onClose: () => {
                            navigate("/errorapi")
                        }
                    })
                })
    
    }
    removePassportSession();
    let { removeCookie } = useContext(AppContext)
    //removeCookie('connect.sid') 
    removeCookie('token')
    //removeCookie('connect.sid')
    document.location = '/'
    return <></>
}