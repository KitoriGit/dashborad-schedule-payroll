import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, Plus, AlertCircle } from 'lucide-react';

export function Settings() {
  const roles = useStore((state) => state.roles);
  const updateRole = useStore((state) => state.updateRole);
  const deleteRole = useStore((state) => state.deleteRole);
  const addRole = useStore((state) => state.addRole);

  const shiftTemplates = useStore((state) => state.shiftTemplates);
  const addShiftTemplate = useStore((state) => state.addShiftTemplate);
  const deleteShiftTemplate = useStore((state) => state.deleteShiftTemplate);

  const [newRoleName, setNewRoleName] = useState('');
  const [newWeekdayRate, setNewWeekdayRate] = useState('');
  const [newWeekendRate, setNewWeekendRate] = useState('');

  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateStart, setNewTemplateStart] = useState('');
  const [newTemplateEnd, setNewTemplateEnd] = useState('');

  const handleAddRole = () => {
    if (!newRoleName.trim() || !newWeekdayRate || !newWeekendRate) return;
    
    // Check if role name already exists (case insensitive)
    if (roles.some(r => r.name.toLowerCase() === newRoleName.trim().toLowerCase())) {
      alert('Ya existe un rol con este nombre.');
      return;
    }

    addRole({
      id: Date.now().toString(),
      name: newRoleName.trim(),
      weekdayRate: Number(newWeekdayRate),
      weekendRate: Number(newWeekendRate)
    });
    setNewRoleName('');
    setNewWeekdayRate('');
    setNewWeekendRate('');
  };

  const handleAddTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateStart || !newTemplateEnd) return;
    
    addShiftTemplate({
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      startTime: newTemplateStart,
      endTime: newTemplateEnd
    });
    setNewTemplateName('');
    setNewTemplateStart('');
    setNewTemplateEnd('');
  };

  const timeOptions = Array.from({ length: 288 }).map((_, i) => {
    const hour = Math.floor(i / 12).toString().padStart(2, '0');
    const minute = ((i % 12) * 5).toString().padStart(2, '0');
    return `${hour}:${minute}`;
  });

  return (
    <div className="flex flex-col h-full w-full max-w-[1440px] mx-auto pb-12">
      {/* Page Header */}
      <header className="flex flex-col mb-12">
        <h1 className="font-heading text-4xl font-semibold text-on-surface">Configuración</h1>
        <p className="font-body text-lg text-on-surface-variant mt-1">Gestiona los roles, permisos y tarifas de tu equipo.</p>
      </header>

      {/* Warning */}
      <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg mb-8 flex gap-3 items-start">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-heading font-bold text-amber-800">Nota sobre eliminación de roles</h3>
          <p className="font-body text-sm text-amber-700 mt-1">
            Si eliminas un rol, todos los empleados que lo tengan asignado pasarán a tener el rol "Sin Rol" y sus pagos se calcularán a $0 la hora hasta que les asignes un rol válido desde la pestaña de Empleados.
          </p>
        </div>
      </div>

      {/* Roles Config Section */}
      <section className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden border border-outline-variant/30">
        <div className="p-6 border-b border-surface-variant bg-surface-container-low">
          <h2 className="font-heading text-xl font-medium text-on-surface">Gestor de Roles y Tarifas</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Los cambios se guardan automáticamente.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant bg-surface/50">
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[30%]">Rol</th>
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[30%]">Tarifa Día Semana ($)</th>
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[30%]">Tarifa Fin de Semana ($)</th>
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right w-[10%]">Acciones</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-on-surface divide-y divide-surface-variant">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-4 px-6 font-bold">{role.name}</td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                      <input 
                        type="number"
                        min="0"
                        value={role.weekdayRate}
                        onChange={(e) => updateRole(role.id, { weekdayRate: Number(e.target.value) })}
                        className="bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary-container pl-7 pr-3 py-2 w-full max-w-[150px] outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                      <input 
                        type="number"
                        min="0"
                        value={role.weekendRate}
                        onChange={(e) => updateRole(role.id, { weekendRate: Number(e.target.value) })}
                        className="bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary-container pl-7 pr-3 py-2 w-full max-w-[150px] outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => {
                        if(window.confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`)) {
                          deleteRole(role.id);
                        }
                      }}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                      title="Eliminar Rol"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Add New Role Row */}
              <tr className="bg-primary-container/5">
                <td className="py-4 px-6">
                  <input 
                    type="text"
                    placeholder="Ej: Repartidor"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="bg-surface-container-highest rounded-lg border border-primary-container/20 focus:ring-2 focus:ring-primary-container px-3 py-2 w-full outline-none"
                  />
                </td>
                <td className="py-4 px-6">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                    <input 
                      type="number"
                      min="0"
                      placeholder="3000"
                      value={newWeekdayRate}
                      onChange={(e) => setNewWeekdayRate(e.target.value)}
                      className="bg-surface-container-highest rounded-lg border border-primary-container/20 focus:ring-2 focus:ring-primary-container pl-7 pr-3 py-2 w-full max-w-[150px] outline-none"
                    />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                    <input 
                      type="number"
                      min="0"
                      placeholder="3500"
                      value={newWeekendRate}
                      onChange={(e) => setNewWeekendRate(e.target.value)}
                      className="bg-surface-container-highest rounded-lg border border-primary-container/20 focus:ring-2 focus:ring-primary-container pl-7 pr-3 py-2 w-full max-w-[150px] outline-none"
                    />
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={handleAddRole}
                    disabled={!newRoleName.trim() || !newWeekdayRate || !newWeekendRate}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} /> Añadir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Shift Templates Section */}
      <section className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden border border-outline-variant/30 mt-8">
        <div className="p-6 border-b border-surface-variant bg-surface-container-low">
          <h2 className="font-heading text-xl font-medium text-on-surface">Plantillas de Horarios Fijos</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">Crea turnos predefinidos para agilizar la asignación diaria.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant bg-surface/50">
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[40%]">Nombre del Turno</th>
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[25%]">Hora de Inicio</th>
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider w-[25%]">Hora de Fin</th>
                <th className="py-4 px-6 font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right w-[10%]">Acciones</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-on-surface divide-y divide-surface-variant">
              {shiftTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-4 px-6 font-bold">{template.name}</td>
                  <td className="py-4 px-6">{template.startTime}</td>
                  <td className="py-4 px-6">{template.endTime}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => {
                        if(window.confirm(`¿Estás seguro de eliminar la plantilla "${template.name}"?`)) {
                          deleteShiftTemplate(template.id);
                        }
                      }}
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                      title="Eliminar Plantilla"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Add New Template Row */}
              <tr className="bg-primary-container/5">
                <td className="py-4 px-6">
                  <input 
                    type="text"
                    placeholder="Ej: Turno Cierre"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="bg-surface-container-highest rounded-lg border border-primary-container/20 focus:ring-2 focus:ring-primary-container px-3 py-2 w-full outline-none"
                  />
                </td>
                <td className="py-4 px-6">
                  <select 
                    value={newTemplateStart}
                    onChange={(e) => setNewTemplateStart(e.target.value)}
                    className="bg-surface-container-highest px-3 py-2 rounded-lg border border-primary-container/20 focus:ring-2 focus:ring-primary-container w-full outline-none cursor-pointer"
                  >
                    <option value="" disabled>Seleccionar hora</option>
                    {timeOptions.map(time => (
                      <option key={`start-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-6">
                  <select 
                    value={newTemplateEnd}
                    onChange={(e) => setNewTemplateEnd(e.target.value)}
                    className="bg-surface-container-highest px-3 py-2 rounded-lg border border-primary-container/20 focus:ring-2 focus:ring-primary-container w-full outline-none cursor-pointer"
                  >
                    <option value="" disabled>Seleccionar hora</option>
                    {timeOptions.map(time => (
                      <option key={`end-${time}`} value={time}>{time}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={handleAddTemplate}
                    disabled={!newTemplateName.trim() || !newTemplateStart || !newTemplateEnd}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} /> Añadir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
