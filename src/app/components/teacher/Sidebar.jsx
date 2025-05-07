'use client';
import '../../../../public/style/teacher.css';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import AcadAllyLogo from '../../../../public/images/teacher/AcadAllyLogo.svg';
import Speed from '../../../../public/images/teacher/SpeedHover.svg';
import Assessment from '../../../../public/images/teacher/Assessment.svg';
import DataAnalytics from '../../../../public/images/teacher/DataAnalytics.svg';
import BookOpen from '../../../../public/images/teacher/BookOpen.svg';
import Todo from '../../../../public/images/teacher/Todo.svg';
import Ellipse from '../../../../public/images/teacher/Ellipse.svg';
import { useTeacher } from '../../context/TeacherContext';
import Skeleton from '../../components/Skeleton';
import { useRouter, usePathname } from "next/navigation";
import Loader from "../../components/teacher/Loader";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoader, setIsLoader] = useState(false);
    const { teacherData } = useTeacher();
    const isNavigating = useRef(false);
    const navigationTimeout = useRef(null);

    // Reset loader when pathname changes
    useEffect(() => {
        setIsLoader(false);
        isNavigating.current = false;
        
        // Clear any pending navigation timeout
        if (navigationTimeout.current) {
            clearTimeout(navigationTimeout.current);
            navigationTimeout.current = null;
        }
    }, [pathname]);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (navigationTimeout.current) {
                clearTimeout(navigationTimeout.current);
            }
        };
    }, []);

    // Navigation map for cleaner code
    const navigationMap = {
        'dashboard': '/teacher/dashboard',
        'classOverview': '/teacher/class_overview',
        'reports': '/teacher/reports',
        'lesson_plans': '/teacher/lesson_plans',
        'todo': '/teacher/todo'
    };

    const handleLinkClick = (link) => {
        // Prevent multiple rapid clicks
        if (isNavigating.current) {
            return;
        }
        
        isNavigating.current = true;
        setIsLoader(true);
        
        try {
            const path = navigationMap[link];
            if (path) {
                router.push(path);
                
                // Set a timeout to reset the navigation state if navigation doesn't complete
                navigationTimeout.current = setTimeout(() => {
                    isNavigating.current = false;
                    setIsLoader(false);
                }, 5000); // 5 second timeout as a fallback
            }
        } catch (error) {
            console.error('Navigation error:', error);
            isNavigating.current = false;
            setIsLoader(false);
        }
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="school-logo-container">
                    {teacherData?.school_logo ? (
                        <Image
                            src={teacherData.school_logo}
                            width={200}
                            height={50}
                            alt="School Logo"
                            style={{ objectFit: 'contain' }}
                        />
                    ) : (
                        <Skeleton width="200px" height="50px" />
                    )}
                </div>

                <div className="sidebar-header-toptxt">
                    <span>Powered By</span>
                    <span className="logo">
                        <Image 
                            src={AcadAllyLogo} 
                            alt="AcadAlly Logo" 
                            width={120} 
                            height={30} 
                        />
                    </span>
                </div>
            </div>

            {/* Sidebar Content */}
            <div className="sidebar-content">
                <button 
                    onClick={() => handleLinkClick('dashboard')} 
                    className={`tch-navink ${pathname.startsWith('/teacher/dashboard') ? 'tch-active' : ''}`}
                    disabled={isNavigating.current}
                >
                    <Image src={Speed} alt="Dashboard" className="hover-image1" width={24} height={24} />
                    <span>Dashboard</span>
                </button>
                <button 
                    onClick={() => handleLinkClick('classOverview')} 
                    className={`tch-navink ${pathname.includes('/teacher/class_overview') || pathname.includes('/teacher/chapter_details') ? 'tch-active' : ''}`}
                    disabled={isNavigating.current}
                >
                    <Image src={Assessment} alt="Class Overview" className="hover-image2" width={24} height={24} />
                    <span>Class Overview</span>
                </button>
                <button 
                    onClick={() => handleLinkClick('reports')} 
                    className={`tch-navink ${pathname.startsWith('/teacher/reports') ? 'tch-active' : ''}`}
                    disabled={isNavigating.current}
                >
                    <Image src={DataAnalytics} alt="Reports" className="hover-image3" width={24} height={24} />
                    <span>Reports</span>
                </button>
                <button 
                    onClick={() => handleLinkClick('todo')} 
                    className={`tch-navink ${pathname.startsWith('/teacher/todo') ? 'tch-active' : ''}`}
                    disabled={isNavigating.current}
                >
                    <Image src={Todo} alt="todo" className="hover-image5" width={24} height={24} />
                    <span>To-Do Task</span>
                </button>
            </div>

            {/* Toggle Button */}
            <button className="toggle-sidebar" onClick={toggleSidebar}>
                <Image src={Ellipse} alt="Expand Sidebar" className="toggle-icon" width={40} height={40} />
            </button>

            {isLoader && <Loader />}
        </div> 
    );
};

export default Sidebar;
