import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../App.jsx';

export default function SignOut() {

    let { removeCookie } = useContext(AppContext)
    removeCookie('token')
    document.location = '/'
    return <></>
}