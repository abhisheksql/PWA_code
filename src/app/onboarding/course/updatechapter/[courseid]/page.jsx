'use client';
import React, { useState } from 'react';
import Header from '../../../../components/Header';
import Sidebar from '../../../../components/Sidebar';
import UpdateChapter from '../../../../components/UpdateChapter';
import { useWindowResize } from '../../../../hooks/useWindowResize'; // Import custom hook

export default function CourseDef({ params }) {
  const { isCollapsed, isSmallScreen, setIsCollapsed } = useWindowResize(); // Use custom hook for screen size handling
  const [sidebarActive, setSidebarActive] = useState("Courses");
  const { courseid } = params;

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
          {courseid ? (
            <UpdateChapter courseid={courseid} /> // Pass courseId to UpdateChapter component
          ) : (
            <p>Loading...</p> // Show a loading state until the courseId is available
          )}
        </main>
      </div>
    </div>
  );
}
