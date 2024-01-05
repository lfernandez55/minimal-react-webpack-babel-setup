import React from 'react'
import { Outlet } from 'react-router-dom'
export default function Teacher() {

    return (
        <>
            <h1>Teacher Tools</h1>
            <Outlet />
        </>
    )
}