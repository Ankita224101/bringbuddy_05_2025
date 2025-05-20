import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import {
  FaUsers,
  FaUniversity,
  FaGraduationCap,
  FaFileAlt,
  FaCheckCircle,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaPray,
} from "react-icons/fa";
import toast from "react-hot-toast";
import "../admin/sidebar.css"; // Importing the CSS file

const Sidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Toggle the sidebar collapse state
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prevState) => !prevState);
    // Persist sidebar state in localStorage
    localStorage.setItem("sidebarCollapsed", (!isSidebarCollapsed).toString());
  }, [isSidebarCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/agent/login");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    // Get sidebar collapse state from localStorage on load
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored === "true") {
      setIsSidebarCollapsed(true);
    }
  }, []);

  return (
    <div className={`custom-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="custom-sidebar-header">
        <div className="custom-sidebar-logo">
          <img src="/images/logo.png" alt="Logo" />
        </div>
        <div className="custom-sidebar-toggle">
          <button className="custom-toggle-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
      </div>

      <ul className="custom-sidebar-menu ">
        <li
          className={`custom-sidebar-menu-item  ${pathname === "/agent/dashboard" ? "active" : ""}`}
        >
          <Link href="/agent/dashboard">
            <div className="custom-menu-icon text-black">
              <FaGraduationCap />
            </div>
            <span className="custom-menu-text text-black">Dashboard</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/agent/students" ? "active" : ""}`}
        >
          <Link href="/agent/students">
            <div className="custom-menu-icon text-black">
              <FaUsers />
            </div>
            <span className="custom-menu-text text-black">Students</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/agent/profile" ? "active" : ""}`}
        >
          <Link href="/agent/profile">
            <div className="custom-menu-icon text-black">
              <CgProfile  />
            </div>
            <span className="custom-menu-text text-black">Profile</span>
          </Link>
        </li>
      </ul>

      <div className="custom-sidebar-footer">
        <button className="custom-logout-btn" onClick={handleLogout}>
          <div className="custom-menu-icon text-black">
            <FaSignOutAlt />
          </div>
          <span className="custom-menu-text text-black">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
