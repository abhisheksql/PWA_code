'use client';
import React from 'react';
import Header from '../../../../components/Header';
import Sidebar from '../../../../components/Sidebar';
import AddChapter from '../../../../components/AddChapter';
import { useWindowResize } from '../../../../hooks/useWindowResize'; // Import custom hook

export default function CourseDef({ params }) {
  const { isCollapsed, isSmallScreen, setIsCollapsed } = useWindowResize(); // Use custom hook for screen size handling

  const { courseid } = params;

  // Toggle sidebar on button click (but only if not on small screen)
  const toggleSidebar = () => {
    if (!isSmallScreen) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="container">
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          {courseid ? (
            <AddChapter courseid={courseid} /> // Pass courseId to AddChapter component
          ) : (
            <p>Loading...</p> // Show a loading state until the courseId is available
          )}
        </main>
      </div>
    </div>
  );
}
