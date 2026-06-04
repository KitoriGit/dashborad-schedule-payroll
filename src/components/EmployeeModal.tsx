import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeModal({ isOpen, onClose }: EmployeeModalProps) {
  const addEmployee = useStore((state) => state.addEmployee);
  
  const [name, setName] = useState('');
  const [dni, setDni] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [role, setRole] = useState('Barista');

  if (!isOpen) return null;

  const handleSave = () => {
    // Basic validation
    if (!name.trim() || !dni.trim() || !dateOfBirth) return;
    
    addEmployee({
      id: Date.now().toString(),
      name: name.trim(),
      dni: dni.trim(),
      dateOfBirth,
      role,
      // Generating a random avatar for the new employee using ui-avatars
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    });
    
    // Reset form and close modal
    setName('');
    setDni('');
    setDateOfBirth('');
    setRole('Barista');
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
      <div className="bg-surface-container-lowest rounded-2xl shadow-soft-hover w-full max-w-lg relative z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <h2 className="font-heading text-2xl font-semibold text-on-surface">Añadir Nuevo Empleado</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-body text-sm font-medium text-on-surface">Nombre del Empleado</label>
            <input 
              type="text" 
              placeholder="ej. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-container-highest px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary-container text-on-surface font-body outline-none transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-body text-sm font-medium text-on-surface">DNI</label>
              <input 
                type="text"
                placeholder="ej. 12.345.678-X"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="bg-surface-container-highest px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary-container text-on-surface font-body outline-none transition-shadow"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-body text-sm font-medium text-on-surface">Fecha de Nacimiento</label>
              <input 
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="bg-surface-container-highest px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary-container text-on-surface font-body outline-none transition-shadow"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-body text-sm font-medium text-on-surface">Rol</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-surface-container-highest px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-primary-container text-on-surface font-body outline-none transition-shadow appearance-none"
            >
              <option>Barista</option>
              <option>Kitchen</option>
              <option>Manager</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-surface-container-low flex justify-end gap-3 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-body text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim() || !dni.trim() || !dateOfBirth}
            className="px-6 py-2 rounded-lg font-body text-sm font-medium bg-primary-container text-on-primary-container hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Guardar Empleado
          </button>
        </div>
      </div>
    </div>
  );
}
