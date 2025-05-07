'use client'
import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import '../../../../../public/style/onboarding.css';
import ReshuffleStudent from '../../../components/ReshuffleStudent';
import { useSearchParams } from 'next/navigation';
export default function Reshuffling() {
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [schoolId, setSchoolid] = useState(0);
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [newSection,setNewSection] = useState(0);
  const [board, setBoard] = useState("");
  const [sectionId, setSectionId] = useState(0);
  const [sidebarActive, setSidebarActive] = useState("Schools");
  const [appliedFilters, setAppliedFilters] = useState([]);
  const schoolNameParam = searchParams.get('schoolName');
  const schoolCodeParam = searchParams.get('schoolCode');
  const boardParam = searchParams.get('schoolBoard');
  const schoolidparam = searchParams.get('schoolEditId');
  const sectionidparam = searchParams.get("sectionid");
  useEffect(() => {
    // Set state based on query parameters
    (schoolNameParam)? setSchoolName(schoolNameParam):'';
    (schoolCodeParam)? setSchoolCode(schoolCodeParam):'';
    (boardParam) ? setBoard(boardParam):'';
    (schoolidparam) ? setSchoolid(schoolidparam):'';
    sectionidparam ? setSectionId(sectionidparam) : 0;
    // (sectionidparam) ? setSectionId(sectionidparam):0;
  }, [schoolNameParam,sectionidparam, schoolCodeParam, boardParam,schoolidparam]);
  // Handle screen width change

  useEffect(() => {
    if(sectionId > 0){
    const sectionArray = Array.isArray(sectionId) ? sectionId : [Number(sectionId)];
    setNewSection(sectionId);
    setAppliedFilters(sectionArray);
    }
  }, [sectionId]);
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
      <Sidebar isCollapsed={isCollapsed} sidebarActive={sidebarActive}/>
      <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        {/* <main>
            <ReshuffleStudent schoolId={schoolId}/>
        </main> */}
        {schoolId > 0 && ( // Only render ReshuffleStud           ent when schoolId is valid
        <main>
          <ReshuffleStudent schoolId={schoolId} schoolName={schoolName} schoolCode={schoolCode} board={board} setAppliedFilters={setAppliedFilters}
            appliedFilters={appliedFilters} sectionId={sectionId} setNewSection={setNewSection} newSection={newSection}/>
        </main>
      )}

      </div>
    </div>
  );
}
