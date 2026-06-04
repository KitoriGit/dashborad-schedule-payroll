import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmployeeModal } from '../components/EmployeeModal';
import { useStore } from '../store/useStore';

export function Employees() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const employees = useStore((state) => state.employees);
  const deleteEmployee = useStore((state) => state.deleteEmployee);
  const updateEmployeeRole = useStore((state) => state.updateEmployeeRole);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <>
      <div className="flex flex-col h-full w-full max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="font-heading text-4xl font-semibold text-on-surface">Directorio del Equipo</h2>
            <p className="font-body text-base text-on-surface-variant mt-1">Gestiona horarios, roles y detalles del personal.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-container text-on-primary-container px-6 py-4 rounded-xl font-body text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all whitespace-nowrap"
            >
              <Plus size={20} />
              Añadir Empleado
            </button>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden border border-outline-variant/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-variant bg-surface-container-low/50">
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider">Empleado</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">DNI</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Fecha de Nacimiento</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Edad</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider">Rol</th>
                  <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant font-body text-sm text-on-surface">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden shrink-0">
                          <img alt={employee.name} className="w-full h-full object-cover" src={employee.avatarUrl} />
                        </div>
                        <span className="font-heading text-lg font-medium">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">{employee.dni}</td>
                    <td className="py-4 px-6 hidden md:table-cell">{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
                    <td className="py-4 px-6 hidden lg:table-cell text-on-surface-variant">{calculateAge(employee.dateOfBirth)} años</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container/10 text-primary-container font-body text-xs font-bold uppercase">{employee.role}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative group/edit">
                          <div className="p-2 text-on-surface-variant group-hover/edit:text-primary-container group-hover/edit:bg-primary-container/10 rounded-lg transition-colors pointer-events-none">
                            <Edit2 size={18} />
                          </div>
                          <select 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            value={employee.role}
                            onChange={(e) => updateEmployeeRole(employee.id, e.target.value)}
                            title="Cambiar rol"
                          >
                            <option value="Manager">Manager</option>
                            <option value="Barista">Barista</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Waiter">Waiter</option>
                            <option value="Cashier">Cashier</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => deleteEmployee(employee.id)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-surface-variant bg-surface-container-lowest flex items-center justify-between text-body text-sm text-on-surface-variant">
            <span>Mostrando {employees.length} empleados</span>
            <div className="flex gap-2">
              <button className="p-2 rounded hover:bg-surface-container-low transition-colors opacity-50 cursor-not-allowed">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 rounded hover:bg-surface-container-low transition-colors text-primary-container">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
