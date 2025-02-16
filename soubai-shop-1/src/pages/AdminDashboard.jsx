import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import RecentOrdersTable from '../components/RecentOrdersTable';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div dir="rtl" className="bg-gray-100 text-black flex flex-col min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-16 right-4 bg-yellow-400 text-black px-4 py-2 rounded-lg z-10"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="p-6 md:mr-64 mt-16"> {/* Added mt-16 for Navbar */}
        <Header title="لوحة التحكم" icon="fa-tachometer-alt" />

        {/* Stats Cards */}
        <StatsCards />

        {/* Recent Orders Table */}
        <RecentOrdersTable />
      </div>
    </div>
  );
};

export default AdminDashboard;