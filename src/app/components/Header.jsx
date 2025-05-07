"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import menu from "../../../public/images/openmenu.svg";
import avtar from "../../../public/images/avatar.png";
import { FiLogOut } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import "../../../public/style/onboarding.css";
import axiosInstance from "../auth";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }) {
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState(avtar);
  const router = useRouter();

  const fetchAdminDetails = async () => {
    try {
      const response = await axiosInstance.get(`onboarding/admin_details/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 200) {
        setProfileUrl(response.data.data.admin_dp || "");
        setUsername(response.data.data.admin_name);
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch admin details:", error);
    }
  };

  // Call the function where needed
  useEffect(() => {
    fetchAdminDetails();
  }, []);

  const avatarToDisplay = avtar;
  // State to manage dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef(null);
  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };
  // Handle logout action
  const handleLogout = () => {
    // Implement your logout logic here
    localStorage.clear();
    router.push("/adminlogin");
    // For example, redirect to login page or clear authentication tokens
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
  return (
    <header className="header">
      <div className="header_left">
        <Image
          src={menu}
          alt="Menu Bar"
          className="menu"
          onClick={toggleSidebar}
          style={{ cursor: "pointer" }}
        />
        <p>Welcome to AcadAlly</p>
      </div>

      <div className="user-info" ref={dropdownRef}>
        <Image
          src={avatarToDisplay}
          alt="User Avatar"
          width={100}
          height={100}
          className="user-avatar"
        />
        <p>{username}</p>
        <FaChevronDown
          onClick={handleDropdownToggle}
          style={{ cursor: "pointer", marginLeft: "10px" }}
        />
        {dropdownOpen && (
          <div className="log-dropdown">
            <button onClick={handleLogout} className="log-dropdown-item">
              <FiLogOut />
              LOG OUT
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
