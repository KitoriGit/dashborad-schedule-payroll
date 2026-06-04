import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeOptions = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

export function ShiftModal({ isOpen, onClose }: ShiftModalProps) {
  const employees = useStore((state) => state.employees);
  const addShift = useStore((state) => state.addShift);
  const shifts = useStore((state) => state.shifts);
  
  const getTodayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [date, setDate] = useState(getTodayStr());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const handleSave = () => {
    setError(null);
    // Basic validation
    if (!selectedEmployeeId || !date || !startTime || !endTime) return;

    const newStartMins = timeToMinutes(startTime);
    const newEndMins = timeToMinutes(endTime);

    if (newStartMins >= newEndMins) {
      setError('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    // Check for collisions
    const hasCollision = shifts.some(shift => {
      if (shift.employeeId !== selectedEmployeeId || shift.date !== date) return false;
      
      const existingStart = timeToMinutes(shift.startTime);
      const existingEnd = timeToMinutes(shift.endTime);

      // Overlap condition: (Start A < End B) and (End A > Start B)
      return newStartMins < existingEnd && newEndMins > existingStart;
    });

    if (hasCollision) {
      const emp = employees.find(e => e.id === selectedEmployeeId);
      setError(`${emp?.name} ya tiene un turno que interfiere en este horario.`);
      return;
    }
    
    addShift({
      id: Date.now().toString(),
      employeeId: selectedEmployeeId,
      date,
      startTime,
      endTime
    });
    
    // Reset form and close modal
    setSelectedEmployeeId(null);
    setDate(getTodayStr());
    setStartTime('');
    setEndTime('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-soft-hover w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 shrink-0">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-on-surface">Asignar Nuevo Turno</h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">Selecciona un empleado y define sus horas de trabajo.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
          
          {/* Employee Selection Grid */}
          <div className="flex flex-col gap-3">
            <label className="font-body text-sm font-bold text-on-surface uppercase tracking-wider">1. Seleccionar Empleado</label>
            
            {employees.length === 0 ? (
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <p className="font-body text-on-surface-variant">No se encontraron empleados. Por favor añade empleados en el directorio primero.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employees.map(employee => {
                  const isSelected = selectedEmployeeId === employee.id;
                  
                  return (
                    <div 
                      key={employee.id}
                      onClick={() => setSelectedEmployeeId(employee.id)}
                      className={`
                        relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'bg-primary-container/10 ring-2 ring-primary-container shadow-sm' 
                          : 'bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 hover:border-outline-variant/60'
                        }
                      `}
                    >
                      {/* Checkmark icon for selected state */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-primary-container">
                          <CheckCircle2 size={16} className="fill-current" />
                        </div>
                      )}
                      
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high">
                        <img src={employee.avatarUrl} alt={employee.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0 pr-4">
                        <span className="font-heading text-base font-medium text-on-surface truncate">{employee.name}</span>
                        <span className="font-body text-xs text-on-surface-variant truncate">{employee.role}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Time & Date Settings */}
          <div className="flex flex-col gap-4">
            <label className="font-body text-sm font-bold text-on-surface uppercase tracking-wider">2. Detalles del Turno</label>
            
            <div className="flex flex-col gap-2">
              <label className="font-body text-sm font-medium text-on-surface">Fecha</label>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-surface-container-highest px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary-container text-on-surface font-body outline-none transition-shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-medium text-on-surface">Hora de Inicio</label>
                <select 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-surface-container-highest px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary-container text-on-surface font-body outline-none transition-shadow cursor-pointer"
                >
                  <option value="" disabled>Seleccionar hora</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-body text-sm font-medium text-on-surface">Hora de Fin</label>
                <select 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-surface-container-highest px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary-container text-on-surface font-body outline-none transition-shadow cursor-pointer"
                >
                  <option value="" disabled>Seleccionar hora</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error/10 text-error rounded-lg font-body text-sm font-medium border border-error/20">
                {error}
              </div>
            )}
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-container-low flex justify-end gap-3 rounded-b-2xl shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-body text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!selectedEmployeeId || !date || !startTime || !endTime}
            className="px-6 py-2 rounded-lg font-body text-sm font-medium bg-primary-container text-on-primary-container hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Guardar Turno
          </button>
        </div>
      </div>
    </div>
  );
}
