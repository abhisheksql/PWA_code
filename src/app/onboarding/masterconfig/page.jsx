// 'use client';
// import React, { useState } from 'react';
// import Header from '../../components/Header';
// import Sidebar from '../../components/Sidebar';
// import { useWindowResize } from '../../hooks/useWindowResize';
// // import MasterCon from '@/app/components/MasterCon';

// export default function CourseDef({ params }) {
//   const { isCollapsed, isSmallScreen, setIsCollapsed } = useWindowResize(); // Use custom hook for screen size handling
//   const [sidebarActive, setSidebarActive] = useState("Courses");
//   const { courseid } = params;

//   // Toggle sidebar on button click (but only if not on small screen)
//   const toggleSidebar = () => {
//     if (!isSmallScreen) {
//       setIsCollapsed(!isCollapsed);
//     }
//   };

//   return (
//     <div className="container">
//       <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive}/>
//       <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
//         <Header toggleSidebar={toggleSidebar} />
//         <main>

//             <MasterCon/>

//           {/* {courseid ? (
//             <UpdateChapter courseid={courseid} /> // Pass courseId to UpdateChapter component
//           ) : (
//             <p>Loading...</p> // Show a loading state until the courseId is available
//           )} */}

//         </main>
//       </div>
//     </div>
//   );
// }









'use client'
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import MasterCon from '../../components/MasterCon';

export default function CreateSchool() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
    handleResize(); // Trigger once on mount to set the initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar on button click (but only if not on small screen)
  const toggleSidebar = () => {
    if (!isSmallScreen) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className='container'>
      <Sidebar isCollapsed={isCollapsed} />
      <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main>
          <MasterCon/>
        </main>
      </div>
    </div>
  );
}

