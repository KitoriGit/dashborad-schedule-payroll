import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (range: DateRange) => void;
  initialRange: DateRange;
}

export function DateRangeModal({ isOpen, onClose, onApply, initialRange }: DateRangeModalProps) {
  // Estado para la navegación del calendario
  const [calendarDate, setCalendarDate] = useState<Date>(
    initialRange.start || new Date()
  );
  
  // Estado para la selección de fechas
  const [start, setStart] = useState<Date | null>(initialRange.start);
  const [end, setEnd] = useState<Date | null>(initialRange.end);

  if (!isOpen) return null;

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  
  const prevMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => daysInPrevMonth - startDayOfWeek + i + 1);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formattedMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(calendarDate);

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    
    if (!start || (start && end)) {
      // Si no hay inicio, o ya hay ambos, reiniciamos la selección
      setStart(clickedDate);
      setEnd(null);
    } else {
      // Si hay inicio pero no fin
      if (clickedDate < start) {
        // Si clickeó un día anterior al inicio, reiniciamos
        setStart(clickedDate);
        setEnd(null);
      } else {
        // Si clickeó un día posterior, cerramos el rango
        setEnd(clickedDate);
      }
    }
  };

  const isSelected = (dayDate: Date) => {
    if (!start) return false;
    if (end) {
      return dayDate >= start && dayDate <= end;
    }
    return dayDate.getTime() === start.getTime();
  };

  const isStartEdge = (dayDate: Date) => start && dayDate.getTime() === start.getTime();
  const isEndEdge = (dayDate: Date) => end && dayDate.getTime() === end.getTime();
  const isInRange = (dayDate: Date) => start && end && dayDate > start && dayDate < end;

  const handleApply = () => {
    onApply({ start, end });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-soft-hover w-full max-w-sm relative z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <h2 className="font-heading text-lg font-semibold text-on-surface">Seleccionar Rango de Fechas</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body: Calendar */}
        <div className="p-4 flex flex-col">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-body text-sm font-bold text-on-surface capitalize">{formattedMonth}</h3>
            <div className="flex gap-1 bg-surface-container-low rounded-full p-0.5">
              <button 
                onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
              <div key={day} className="font-body text-xs font-bold text-on-surface-variant uppercase">
                {day}
              </div>
            ))}
            
            {/* Previous month empty slots */}
            {prevMonthDays.map((day, idx) => (
              <div key={`prev-${idx}`} className="py-1.5 text-sm font-body text-on-surface-variant/30">
                {day}
              </div>
            ))}

            {/* Current month days */}
            {monthDays.map(day => {
              const dayDate = new Date(currentYear, currentMonth, day);
              const selected = isSelected(dayDate);
              const isStart = isStartEdge(dayDate);
              const isEnd = isEndEdge(dayDate);
              const inRange = isInRange(dayDate);

              return (
                <div key={day} className="relative py-1 cursor-pointer" onClick={() => handleDayClick(day)}>
                  {/* Fondo para el rango (conecta los bordes visualmente) */}
                  {selected && end && (
                    <div className={`absolute inset-y-1 bg-primary-container/20 -z-10
                      ${isStart ? 'left-1/2 right-0' : ''}
                      ${isEnd ? 'left-0 right-1/2' : ''}
                      ${inRange ? 'left-0 right-0' : ''}
                    `}></div>
                  )}
                  
                  {/* Círculo del día */}
                  <div className={`mx-auto w-8 h-8 flex items-center justify-center rounded-full font-body text-sm transition-colors
                    ${(isStart || isEnd) ? 'bg-primary-container text-on-primary-container font-bold shadow-sm' : ''}
                    ${(!isStart && !isEnd && inRange) ? 'text-primary-container font-medium' : ''}
                    ${!selected ? 'text-on-surface hover:bg-surface-container-high' : ''}
                  `}>
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
          <div className="font-body text-xs text-on-surface-variant">
            {start ? start.toLocaleDateString() : 'Inicio'} - {end ? end.toLocaleDateString() : 'Fin'}
          </div>
          <button 
            onClick={handleApply}
            disabled={!start || !end}
            className="px-4 py-1.5 rounded-lg font-body text-sm font-medium bg-primary-container text-on-primary-container hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Aplicar Rango
          </button>
        </div>
      </div>
    </div>
  );
}
