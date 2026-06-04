import React from 'react';
import { Sidebar } from '../components/Sidebar';
import type { PageType } from '../components/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="ml-[280px] flex-grow p-8">
        {children}
      </main>
    </div>
  );
}
