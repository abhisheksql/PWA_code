

'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import '../../../../../public/style/onboarding.css';
import Courses from '../../../components/Courses';


export default function Admin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState("Courses");
  // Handle screen width change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 925) {
        setIsSmallScreen(true); // Automatically collapse sidebar for small screens
        setIsCollapsed(true); // Collapse sidebar
      } else {
        setIsSmallScreen(false); // Enable normal functionality above 925px
        setIsCollapsed(false); // Default to expanded sidebar for large screens
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar on button click (but only if not on small screen)
  const toggleSidebar = () => {
    if (!isSmallScreen) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="container">
      <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive}/>
      <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <Courses/>
        </main>
      </div>
    </div>
  );
}
