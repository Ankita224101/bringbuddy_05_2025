import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  ProgressBar,
  Form,
  Spinner,
  Dropdown,
} from "react-bootstrap";
import toast from "react-hot-toast";

import {
  FaUsers,
  FaUniversity,
  FaGraduationCap,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserEdit,
  FaArrowRight,
  FaSignOutAlt,
  FaEye,
  FaTrash,
  FaBars,
  FaSearch,
  FaBell,
  FaCog,
  FaTachometerAlt,
  FaRegClock,
  FaRegCalendarAlt,
  FaChartLine,
  FaShoppingCart,
  FaGlobe,
  FaDesktop,
  FaMobileAlt,
  FaDatabase,
  FaBuilding,
  FaUserFriends,
} from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import "./Header.css";

const Header = () => {
  const toggleMobileSidebar = useCallback(() => {
    const sidebarElement = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    if (sidebarElement && mainContent) {
      sidebarElement.classList.toggle("sidebar-open");

      // Add overlay when sidebar is open on mobile
      if (sidebarElement.classList.contains("sidebar-open")) {
        const overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        overlay.addEventListener("click", toggleMobileSidebar);
        mainContent.appendChild(overlay);
      } else {
        // Remove overlay when sidebar is closed
        const overlay = document.querySelector(".sidebar-overlay");
        if (overlay) {
          overlay.remove();
        }
      }
    }
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/admin/login");
    toast.success("Logged out successfully");
  };
  const [adminDetails, setAdminDetails] = useState({});

  useEffect(() => {
    axios("/admin/api/get-admin")
      .then((res) => {
        console.log("admin fetch : ", res.data);
        setAdminDetails(res.data.admins);
      })
      .catch((err) => {
        console.error("Error fetching admin:", err);
      });
  }, []);

  return (
    <div>
      <div className="dashboard-navbar">
        <div className="navbar-left">
          <button
            className="mobile-toggle-btn d-lg-none"
            onClick={toggleMobileSidebar}
          >
            <FaBars />
          </button>
          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="navbar-right" style={{ marginRight: "30px" }}>
          <div className="notification-bell">
            <FaBell />
            <span className="notification-badge">5</span>
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-pic">
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt="Admin"
                  />
                </div>
                <div className="profile-name">
                  <span>{adminDetails?.name}</span>
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="profile-menu">
              <Dropdown.Item href="/admin/profile">
                <FaUserEdit className="me-2" /> Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Header;
