"use client"
import useAuth from "../../../utils/auth";
import Sidebar from '@/components/Sidebar';
import Header from "@/components/Header";
export default function AuthLayout({children}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null; 

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          {children}{" "}   
        </div>
      </div>
    </div>
  );
}