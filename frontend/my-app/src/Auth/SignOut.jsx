import React from 'react'
export default function SignOut() {

    const removePassportSession = () =>{
            
            fetch(import.meta.env.VITE_REACT_APP_BASE_URL + 'api/users/signout', {
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
                    console.log(error)
                })
    
    }
    removePassportSession();
    document.location = '/'
    return <></>
}