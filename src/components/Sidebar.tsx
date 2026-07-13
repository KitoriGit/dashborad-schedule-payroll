import { Calendar, CircleDollarSign, Users, Settings } from 'lucide-react';

export type PageType = 'schedules' | 'payroll' | 'employees' | 'settings';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const getTabClass = (page: PageType) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all duration-200 ease-in-out font-body text-sm font-medium border-l-4";
    if (currentPage === page) {
      return `${baseClass} text-surface bg-primary-container/10 border-primary-container hover:bg-white/5`;
    }
    return `${baseClass} text-secondary hover:text-surface border-transparent hover:bg-white/5`;
  };

  return (
    <nav className="bg-[#43302B] fixed left-0 top-0 h-full w-[280px] shadow-soft flex flex-col py-8 z-50">
      {/* Header */}
      <div className="px-6 mb-12">
        <h1 className="font-heading text-2xl font-bold text-surface">Brew & Bites</h1>
        <p className="font-body text-sm text-surface-variant/70 mt-1">Retail Management</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-grow flex flex-col gap-2 px-2">
        <button onClick={() => onNavigate('schedules')} className={getTabClass('schedules')}>
          <Calendar size={20} />
          <span>Horarios</span>
        </button>

        <button onClick={() => onNavigate('payroll')} className={getTabClass('payroll')}>
          <CircleDollarSign size={20} />
          <span>Nómina</span>
        </button>

        <button onClick={() => onNavigate('employees')} className={getTabClass('employees')}>
          <Users size={20} />
          <span>Empleados</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-2 mt-auto">
        <button 
          onClick={() => onNavigate('settings')}
          className={`flex items-center w-full gap-3 px-4 py-3 transition-colors border-l-4 hover:bg-white/5 rounded-r-lg ${
            currentPage === 'settings' 
              ? 'text-surface bg-primary-container/10 border-primary-container' 
              : 'text-surface-variant/70 hover:text-surface border-transparent'
          }`}
        >
          <Settings size={20} className={currentPage === 'settings' ? 'text-primary-container' : 'text-[#c4c4c4]'} />
          <span className="font-body text-sm font-medium">Configuración</span>
        </button>
      </div>
    </nav>
  );
}
