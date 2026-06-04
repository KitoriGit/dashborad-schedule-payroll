import { useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Schedules } from './pages/Schedules';
import { Payroll } from './pages/Payroll';
import { Employees } from './pages/Employees';
import type { PageType } from './components/Sidebar';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('schedules');

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'schedules' && <Schedules />}
      {currentPage === 'payroll' && <Payroll />}
      {currentPage === 'employees' && <Employees />}
    </DashboardLayout>
  )
}
