import React from 'react'
import banner from "../assets/banner.jpg"
function Dashboard() {
    return (
        <div className="w-full h-auto object-cover">
            <img className='w-full h-auto object-cover' alt='logo' src={banner}></img>
        </div>
    )
}

export default Dashboard