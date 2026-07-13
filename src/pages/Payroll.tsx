import { useState } from 'react';
import { CalendarDays, ChevronDown, Clock, Sofa, Wallet, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { DateRangeModal, type DateRange } from '../components/DateRangeModal';

export function Payroll() {
  const employees = useStore((state) => state.employees);
  const shifts = useStore((state) => state.shifts);
  const roles = useStore((state) => state.roles);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id || '');
  
  // Rango por defecto (Mes actual)
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const defaultEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [dateRange, setDateRange] = useState<DateRange>({ start: defaultStart, end: defaultEnd });
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Filtrar turnos del empleado en el rango de fechas
  const filteredShifts = shifts.filter(shift => {
    if (shift.employeeId !== selectedEmployeeId) return false;
    if (!dateRange.start || !dateRange.end) return false;
    
    // Convertir string "YYYY-MM-DD" a fecha en tiempo local
    const shiftDate = new Date(shift.date + 'T00:00:00');
    return shiftDate >= dateRange.start && shiftDate <= dateRange.end;
  });

  // Funciones de cálculo
  const calculateHours = (start: string, end: string) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let hours = (endH + endM / 60) - (startH + startM / 60);
    if (hours < 0) hours += 24;
    return hours;
  };

  const isWeekend = (dateStr: string) => {
    const shiftDate = new Date(dateStr + 'T00:00:00');
    const day = shiftDate.getDay();
    return day === 0 || day === 6;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);
  const employeeRole = roles.find(r => r.name === selectedEmployee?.role);
  
  // Si no tiene rol o el rol fue eliminado, las tarifas son 0
  const activeWeekdayRate = employeeRole?.weekdayRate || 0;
  const activeWeekendRate = employeeRole?.weekendRate || 0;

  let weekdayHoursTotal = 0;
  let weekendHoursTotal = 0;
  
  const tableRows = filteredShifts.sort((a, b) => a.date.localeCompare(b.date)).map(shift => {
    const hours = calculateHours(shift.startTime, shift.endTime);
    const weekend = isWeekend(shift.date);
    const rate = weekend ? activeWeekendRate : activeWeekdayRate;
    const subtotal = hours * rate;

    if (weekend) weekendHoursTotal += hours;
    else weekdayHoursTotal += hours;

    const formattedDate = new Intl.DateTimeFormat('es-ES', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(shift.date + 'T00:00:00'));

    return {
      id: shift.id,
      formattedDate,
      weekend,
      hours: hours.toFixed(1),
      rate,
      subtotal
    };
  });

  const weekdayPayout = weekdayHoursTotal * activeWeekdayRate;
  const weekendPayout = weekendHoursTotal * activeWeekendRate;
  const totalPayout = weekdayPayout + weekendPayout;

  const exportToCSV = () => {
    if (tableRows.length === 0) {
      alert("No hay datos para exportar en este rango de fechas.");
      return;
    }

    // Cabeceras del CSV
    const headers = ["Fecha", "Tipo de Turno", "Horas Trabajadas", "Tarifa por Hora", "Subtotal"];
    
    // Filas de datos
    const csvRows = tableRows.map(row => {
      const type = row.weekend ? 'Fin de Semana' : 'Día de Semana';
      return `"${row.formattedDate}","${type}","${row.hours}","${row.rate}","${row.subtotal}"`;
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // Crear el archivo descargable
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for BOM (UTF-8 Excel compatibility)
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const safeName = (selectedEmployee?.name || 'empleado').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute("href", url);
    link.setAttribute("download", `nomina_${safeName}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rangeString = dateRange.start && dateRange.end 
    ? `${new Intl.DateTimeFormat('es-ES', { month: 'short', day: 'numeric' }).format(dateRange.start)} - ${new Intl.DateTimeFormat('es-ES', { month: 'short', day: 'numeric' }).format(dateRange.end)}`
    : 'Seleccionar Rango';

  return (
    <>
      <div className="flex flex-col h-full w-full max-w-[1440px] mx-auto">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="font-heading text-4xl font-semibold text-on-surface">Calculadora de Nómina</h1>
            <p className="font-body text-lg text-on-surface-variant mt-1">Revisa y aprueba los datos de compensación.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {/* Employee Select */}
            <div className="relative group">
              <select 
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-body text-sm font-medium rounded-lg pl-4 pr-10 py-2 shadow-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 cursor-pointer"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
            </div>
            
            {/* Date Range Select */}
            <div className="relative group">
              <div 
                onClick={() => setIsDateModalOpen(true)}
                className="flex items-center bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-2 shadow-sm hover:border-primary-container/50 transition-colors cursor-pointer"
              >
                <CalendarDays size={18} className="text-on-surface-variant mr-2" />
                <span className="font-body text-sm font-medium text-on-surface">{rangeString}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Weekday Hours */}
          <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-soft relative overflow-hidden flex flex-col justify-between group hover:shadow-soft-hover transition-shadow">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
            <div>
              <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                <Clock size={20} />
                <h3 className="font-body text-sm font-bold uppercase tracking-wider">Horas de Semana</h3>
              </div>
              <div className="font-heading text-3xl font-semibold text-on-surface mt-2">
                {weekdayHoursTotal.toFixed(1)} <span className="font-body text-base font-normal text-on-surface-variant">hrs</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-surface-variant flex justify-between items-center font-body text-sm text-on-surface-variant">
              <span>Tarifa Base: {formatCurrency(activeWeekdayRate)}/hr</span>
              <span className="font-bold text-on-surface">{formatCurrency(weekdayPayout)}</span>
            </div>
          </div>

          {/* Weekend Hours */}
          <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-soft relative overflow-hidden flex flex-col justify-between group hover:shadow-soft-hover transition-shadow">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
            <div>
              <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                <Sofa size={20} />
                <h3 className="font-body text-sm font-bold uppercase tracking-wider">Horas Fin de Semana</h3>
              </div>
              <div className="font-heading text-3xl font-semibold text-on-surface mt-2">
                {weekendHoursTotal.toFixed(1)} <span className="font-body text-base font-normal text-on-surface-variant">hrs</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-surface-variant flex justify-between items-center font-body text-sm text-on-surface-variant">
              <span>Tarifa Premium: {formatCurrency(activeWeekendRate)}/hr</span>
              <span className="font-bold text-on-surface">{formatCurrency(weekendPayout)}</span>
            </div>
          </div>

          {/* Total Payout */}
          <div className="md:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
              <Wallet size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="font-body text-sm font-bold uppercase tracking-wider opacity-80 mb-2">Pago Total</h3>
              <div className="font-heading text-5xl font-bold">{formatCurrency(totalPayout)}</div>
              <div className="font-body text-sm font-medium opacity-80 mt-1">por {(weekdayHoursTotal + weekendHoursTotal).toFixed(1)} horas</div>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden">
          <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
            <h2 className="font-heading text-xl font-medium text-on-surface">Desglose de Turnos</h2>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 font-body text-xs font-bold text-tertiary hover:text-primary-container transition-colors uppercase"
            >
              <Download size={18} /> Exportar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-variant bg-surface/50">
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[20%]">Fecha</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[20%]">Tipo de Turno</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right w-[20%]">Horas Trabajadas</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right w-[20%]">Tarifa</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right w-[20%]">Subtotal</th>
                </tr>
              </thead>
              <tbody className="font-body text-base text-on-surface divide-y divide-surface-variant">
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant font-body">
                      No se encontraron turnos para este empleado en el rango de fechas seleccionado.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((row) => (
                    <tr key={row.id} className={`hover:bg-surface-container/30 transition-colors group ${row.weekend ? 'bg-surface-container-low/50' : ''}`}>
                      <td className="py-4 px-6">{row.formattedDate}</td>
                      <td className="py-4 px-6">
                        {row.weekend ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-body text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Finde
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-body text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Semana
                          </span>
                        )}
                      </td>
                      <td className={`py-4 px-6 text-right font-medium ${row.weekend ? 'text-primary-container' : ''}`}>{row.hours}</td>
                      <td className="py-4 px-6 text-right text-on-surface-variant">{formatCurrency(row.rate)}</td>
                      <td className="py-4 px-6 text-right font-medium">{formatCurrency(row.subtotal)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <DateRangeModal 
        isOpen={isDateModalOpen} 
        onClose={() => setIsDateModalOpen(false)} 
        initialRange={dateRange}
        onApply={(range) => {
          setDateRange(range);
          setIsDateModalOpen(false);
        }}
      />
    </>
  );
}
