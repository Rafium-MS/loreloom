import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAppState } from '../core/state/store';

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  const focusMode = useAppState((s) => s.focusMode);

  return (
    <div className="flex h-screen">
      {!focusMode && <Sidebar />}
      <div className="flex flex-col flex-1">
        {!focusMode && <Topbar />}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;