   "use client"

    import Sidebar from '@/components/admin/Sidebar'; 
    import Header from "@/components/admin/Header";
     export default function AuthLayout({children}) {




     return (
       <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          {children}{" "}
          {/* This will render the page content (e.g. Dashboard data) */}
        </div>
      </div>
    </div>
  );
}
