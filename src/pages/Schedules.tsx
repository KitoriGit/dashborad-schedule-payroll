import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Pencil } from 'lucide-react';
import { ShiftModal } from '../components/ShiftModal';
import { useStore, type Shift } from '../store/useStore';

export function Schedules() {
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | undefined>(undefined);
  const shifts = useStore((state) => state.shifts);
  const employees = useStore((state) => state.employees);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  
  // En lugar de días vacíos, calculamos los números de los últimos días del mes anterior
  const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => daysInPrevMonth - startDayOfWeek + i + 1);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Funciones auxiliares para colores según rol
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Barista': return 'bg-emerald-400';
      case 'Kitchen': return 'bg-primary-container';
      case 'Manager': return 'bg-amber-400';
      default: return 'bg-surface-variant';
    }
  };
  
  const getRoleTextColor = (role: string) => {
    switch(role) {
      case 'Barista': return 'text-emerald-700';
      case 'Kitchen': return 'text-primary-container';
      case 'Manager': return 'text-amber-700';
      default: return 'text-on-surface-variant';
    }
  };

  const getRoleBgLight = (role: string) => {
    switch(role) {
      case 'Barista': return 'bg-emerald-400/10';
      case 'Kitchen': return 'bg-primary-container/10';
      case 'Manager': return 'bg-amber-400/10';
      default: return 'bg-surface-variant/10';
    }
  };

  // Cálculos del panel derecho
  const selectedDateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDayShifts = shifts.filter(s => s.date === selectedDateString);
  const formattedSelectedDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', month: 'short', day: 'numeric' }).format(selectedDate);
  const formattedMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(calendarDate);

  return (
    <>
      <div className="grid grid-cols-10 gap-6 h-full">
        {/* Center: Main Calendar (6 cols) */}
        <section className="col-span-6 flex flex-col gap-6">
          {/* Calendar Header */}
          <header className="flex justify-between items-center bg-surface-container-lowest shadow-soft rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-1 bg-surface-container-low rounded-full p-1">
                <button 
                  onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <h2 className="font-heading text-3xl font-semibold text-on-surface min-w-[200px]">{formattedMonth}</h2>
            </div>
            <button
              onClick={() => {
                setEditingShift(undefined);
                setIsShiftModalOpen(true);
              }}
              className="bg-primary-container text-on-primary-container font-body text-sm font-medium px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Nuevo Turno
            </button>
          </header>

          {/* Calendar Grid */}
          <div className="bg-surface-container-lowest shadow-soft rounded-2xl p-4 flex-grow flex flex-col">
            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="text-center font-body text-xs font-bold text-on-surface-variant py-2 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 flex-grow">
              {prevMonthDays.map(day => (
                <div key={`prev-${day}`} className="bg-surface-container-low rounded-xl min-h-[100px] p-2 hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <span className="font-body text-sm block text-right group-hover:text-primary-container text-on-surface-variant opacity-50">
                    {day}
                  </span>
                </div>
              ))}

              {monthDays.map(day => {
                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayShifts = shifts.filter(s => s.date === dateString);
                const isActive = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth;
                
                // Max 3 dots for aesthetic purposes
                const dotsToRender = dayShifts.slice(0, 3);

                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                    className={`rounded-xl min-h-[100px] p-2 cursor-pointer transition-colors group relative overflow-hidden ${
                      isActive 
                        ? 'bg-surface-container-lowest ring-2 ring-primary-container shadow-md' 
                        : 'bg-surface-container-low hover:bg-surface-container-high'
                    }`}
                  >
                    {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>}
                    <span className={`font-body text-sm block text-right mt-1 ${
                      isActive ? 'font-bold text-primary-container' : 'group-hover:text-primary-container text-on-surface'
                    }`}>
                      {day}
                    </span>
                    <div className={`flex flex-wrap gap-1 justify-end ${isActive ? 'mt-2' : 'mt-1'}`}>
                      {dotsToRender.map((shift, i) => {
                        const employee = employees.find(e => e.id === shift.employeeId);
                        const roleColor = getRoleColor(employee?.role || '');
                        return (
                          <div key={i} className={`rounded-full ${roleColor} ${isActive ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}></div>
                        );
                      })}
                      {dayShifts.length > 3 && (
                        <div className={`rounded-full bg-on-surface-variant ${isActive ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right: Day Detail Panel */}
        <section className="col-span-4 flex flex-col gap-6">
          {/* Panel Header */}
          <header className="bg-surface/60 backdrop-blur-md rounded-2xl p-6 flex justify-between items-end border border-outline-variant/30">
            <div>
              <p className="font-body text-xs font-bold text-primary-container uppercase tracking-widest mb-1">Horario del</p>
              <h3 className="font-heading text-2xl font-medium text-on-surface capitalize">{formattedSelectedDate}</h3>
            </div>
            <span className="font-body text-sm text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
              {selectedDayShifts.length} {selectedDayShifts.length === 1 ? 'Turno' : 'Turnos'}
            </span>
          </header>

          {/* Shift List */}
          <div className="flex flex-col gap-4">
            {selectedDayShifts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant/30 border-dashed">
                <p className="font-body text-on-surface-variant">No hay turnos programados para este día.</p>
              </div>
            ) : (
              selectedDayShifts.map((shift) => {
                const employee = employees.find(e => e.id === shift.employeeId);
                if (!employee) return null;
                
                return (
                  <article key={shift.id} className="bg-surface-container-lowest rounded-2xl shadow-soft relative overflow-hidden flex items-center p-4 hover:shadow-soft-hover transition-shadow duration-300">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getRoleColor(employee.role)}`}></div>
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 shrink-0 bg-surface-container-high">
                      <img className="w-full h-full object-cover" src={employee.avatarUrl} alt={employee.name} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-body text-sm font-medium text-on-surface">{employee.name}</h4>
                      <p className="font-body text-sm text-on-surface-variant mt-0.5">{shift.startTime} - {shift.endTime}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className={`${getRoleBgLight(employee.role)} ${getRoleTextColor(employee.role)} font-body text-xs font-bold px-2.5 py-0.5 rounded-full uppercase`}>
                        {employee.role}
                      </span>
                      <button 
                        onClick={() => {
                          setEditingShift(shift);
                          setIsShiftModalOpen(true);
                        }}
                        className="p-1 text-on-surface-variant hover:text-primary-container hover:bg-surface-container-highest rounded-md transition-colors mt-auto"
                        title="Editar Turno"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
      <ShiftModal 
        isOpen={isShiftModalOpen} 
        onClose={() => setIsShiftModalOpen(false)} 
        initialShift={editingShift}
      />
    </>
  );
}
