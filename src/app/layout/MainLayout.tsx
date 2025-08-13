import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout: React.FC = () => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Topbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default MainLayout;
