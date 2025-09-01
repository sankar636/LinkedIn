import React, { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import NetworkSidebar from '../components/NetworkSidebar.jsx'
import MainContent from '../components/MainContent.jsx'


const MyNetwork = () => {
    const [activeTab, setActiveTab] = useState("connections")
    
    return (
        <div className='bg-gray-100 min-h-screen w-full flex items-start justify-center gap-[10px] flex-col sm:flex-row relative'>
            <Navbar />
            <div className="w-[95%] md:w-[40%] lg:w-[30%] sm:min-h-[200px] h-0  p-[10px] relative mx-auto lg:mx-6 sm:mt-20">
                <NetworkSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className='w-[95%] md:w-[52%] lg:w-[65%] min-h-[200px] lg p-[10px] relative mx-auto lg:mx-6 mt-10 sm:mt-20'>
                <MainContent activeTab={activeTab} />
            </div>

        </div>
    )
}

export default MyNetwork