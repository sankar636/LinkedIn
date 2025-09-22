import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import NetworkSidebar from '../components/NetworkSidebar.jsx';
import MainContent from '../components/MainContent.jsx';

const MyNetwork = () => {
  const [activeTab, setActiveTab] = useState('connections');

  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-center gap-[10px] bg-gray-100 sm:flex-row">
      <Navbar />
      <div className="relative mx-auto h-0 w-[95%] p-[10px] sm:mt-20 sm:min-h-[200px] md:w-[40%] lg:mx-6 lg:w-[30%]">
        <NetworkSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="lg relative mx-auto mt-10 min-h-[200px] w-[95%] p-[10px] sm:mt-20 md:w-[52%] lg:mx-6 lg:w-[65%]">
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default MyNetwork;
