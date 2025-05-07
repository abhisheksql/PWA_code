"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Acadally_logo from "../../../public/images/acadallyLogo.svg";
import "../../../public/style/onboarding.css";
import Acadally_collapsed_logo from "../../../public/images/Acadally_Logo_colleps.svg";
import School from "../../../public/images/schoolHover.svg";
import Book from "../../../public/images/bookHover.svg";
import Users from "../../../public/images/UsersHover.svg";
import { useRouter } from "next/navigation";

export default function Sidebar({ isCollapsed, sidebarActive }) {
  const router = useRouter(); // Initialize the router

  const logoSource = isCollapsed ? Acadally_collapsed_logo : Acadally_logo;
  const handleClick = (section) => {
    // Navigate to the correct routes
    if (section === "Courses") {
      router.push("/onboarding/course/list");
    } else if (section === "Schools") {
      router.push("/onboarding");
    } 
    // else if (section === "Master") {
    //   router.push("/onboarding/masterconfig");
    // }
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <Image
        src={logoSource}
        alt="Acadally logo"
        className={`comp_logo ${isCollapsed ? "collapsed-logo" : ""}`} // Conditionally add a class
        style={
          isCollapsed
            ? { width: "60px", height: "60px", marginTop: "15px" }
            : {}
        }
      />
      <nav>
        <button
          className={`sidenav_top ${sidebarActive === "Schools" ? "active" : ""
            }`}
          onClick={() => {
            handleClick("Schools");
          }}
        >
          <Image src={School} alt="Acadally logo" className="hover-img1" />
          <p>Schools</p>
        </button>
        <button
          className={`sidenav_top ${sidebarActive === "Courses" ? "active" : ""
            }`}
          onClick={() => {
            handleClick("Courses");
          }}
        >
          <Image src={Book} alt="Acadally logo" className="hover-img2" />
          <p>Courses</p>
        </button>

        {/* <button
          className={`sidenav_top ${sidebarActive === "Master" ? "active" : ""}`}
          onClick={() => handleClick("Master")}
        >
          <Image src={Users} alt="Master Config Icon" className="hover-img3" />
          <p>Master Config</p>
        </button> */}
      </nav>
    </div>
  );
}
