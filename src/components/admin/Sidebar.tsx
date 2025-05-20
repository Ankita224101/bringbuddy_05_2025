import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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
} from "react-icons/fa";
import toast from "react-hot-toast";
import "./sidebar.css"; // Importing the CSS file

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
    router.push("/admin/login");
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
          className={`custom-sidebar-menu-item  ${pathname === "/admin/dashboard" ? "active" : ""}`}
        >
          <Link href="/admin/dashboard">
            <div className="custom-menu-icon text-black">
              <FaGraduationCap />
            </div>
            <span className="custom-menu-text text-black">Dashboard</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/admin/users" ? "active" : ""}`}
        >
          <Link href="/admin/users">
            <div className="custom-menu-icon text-black">
              <FaUsers />
            </div>
            <span className="custom-menu-text text-black">Users</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/admin/agents" ? "active" : ""}`}
        >
          <Link href="/admin/agents">
            <div className="custom-menu-icon text-black">
              <FaUsers />
            </div>
            <span className="custom-menu-text text-black">Agents</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/admin/applications" ? "active" : ""}`}
        >
          <Link href="/admin/applications">
            <div className="custom-menu-icon text-black">
              <FaFileAlt />
            </div>
            <span className="custom-menu-text text-black">Applications</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/admin/programs" ? "active" : ""}`}
        >
          <Link href="/admin/programs">
            <div className="custom-menu-icon text-black ">
              <FaGraduationCap />
            </div>
            <span className="custom-menu-text text-black">Programs</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/admin/universities" ? "active" : ""}`}
        >
          <Link href="/admin/universities">
            <div className="custom-menu-icon text-black">
              <FaUniversity />
            </div>
            <span className="custom-menu-text text-black">Universities</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/admin/payments" ? "active" : ""}`}
        >
          <Link href="/admin/payments">
            <div className="custom-menu-icon text-black">
              <FaCheckCircle />
            </div>
            <span className="custom-menu-text text-black">Payments</span>
          </Link>
        </li>
        <li
          className={`custom-sidebar-menu-item ${pathname === "/admin/profile" ? "active" : ""}`}
        >
          <Link href="/admin/profile">
            <div className="custom-menu-icon text-black">
              <FaCog />
            </div>
            <span className="custom-menu-text text-black ">Profile</span>
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
