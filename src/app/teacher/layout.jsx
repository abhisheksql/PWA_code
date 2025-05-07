'use client';
import '../../../public/style/teacher.css';
import React, { useState } from 'react';
import Sidebar from '../components/teacher/Sidebar';
import Header from '../components/teacher/Header';
import { TeacherProvider } from '../context/TeacherContext';
import { ToastContainer } from 'react-toastify'; // Toast container for rendering the toasts
import 'react-toastify/dist/ReactToastify.css';

export default function TeacherLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <TeacherProvider teacherId={18}>
      <ToastContainer />
      <div className="dashboard-page">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content-wrapper">
          <Header toggleSidebar={toggleSidebar} />
          {children} {/* This renders the current page content */}
        </div>
      </div>
    </TeacherProvider>
  );
}
