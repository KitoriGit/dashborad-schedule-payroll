import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  name: string;
  dni: string;
  dateOfBirth: string; // Formato YYYY-MM-DD
  role: string;
  avatarUrl: string;
}

export interface Role {
  id: string;
  name: string;
  weekdayRate: number;
  weekendRate: number;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  date: string; // Formato YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

interface AppState {
  employees: Employee[];
  shifts: Shift[];
  roles: Role[];
  shiftTemplates: ShiftTemplate[];

  addEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  updateEmployeeRole: (id: string, role: string) => void;
  addShift: (shift: Shift) => void;
  addShifts: (shifts: Shift[]) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addShiftTemplate: (template: ShiftTemplate) => void;
  deleteShiftTemplate: (id: string) => void;
}

// Datos iniciales de prueba (Mock Data)
const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Mateo García',
    dni: '12.345.678-X',
    dateOfBirth: '1995-04-15',
    role: 'Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    dni: '87.654.321-Y',
    dateOfBirth: '1998-08-22',
    role: 'Barista',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
  }
];

const initialShifts: Shift[] = [
  { id: 's1', employeeId: '1', date: '2026-06-03', startTime: '08:00', endTime: '16:00' },
  { id: 's2', employeeId: '1', date: '2026-06-04', startTime: '08:00', endTime: '16:00' },
  { id: 's3', employeeId: '1', date: '2026-06-05', startTime: '08:00', endTime: '16:00' },
  { id: 's4', employeeId: '2', date: '2026-06-04', startTime: '09:00', endTime: '14:00' },
  { id: 's5', employeeId: '2', date: '2026-06-06', startTime: '10:00', endTime: '18:00' }, // Weekend
  { id: 's6', employeeId: '2', date: '2026-06-07', startTime: '10:00', endTime: '18:00' }  // Weekend
];

const initialRoles: Role[] = [
  { id: 'r1', name: 'Manager', weekdayRate: 3500, weekendRate: 4000 },
  { id: 'r2', name: 'Barista', weekdayRate: 3000, weekendRate: 3500 },
  { id: 'r3', name: 'Kitchen', weekdayRate: 3000, weekendRate: 3500 },
];

const initialShiftTemplates: ShiftTemplate[] = [
  { id: 't1', name: 'Turno Mañana', startTime: '08:00', endTime: '16:00' },
  { id: 't2', name: 'Turno Tarde', startTime: '16:00', endTime: '00:00' }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      employees: initialEmployees,
      shifts: initialShifts,
      roles: initialRoles,
      shiftTemplates: initialShiftTemplates,
      
      addEmployee: (employee) => set((state) => ({ 
        employees: [...state.employees, employee] 
      })),
      
      deleteEmployee: (id) => set((state) => ({ 
        employees: state.employees.filter(e => e.id !== id) 
      })),

      updateEmployeeRole: (id, role) => set((state) => ({
        employees: state.employees.map(e => e.id === id ? { ...e, role } : e)
      })),

      addShift: (shift) => set((state) => ({
        shifts: [...state.shifts, shift]
      })),

      addShifts: (newShifts) => set((state) => ({
        shifts: [...state.shifts, ...newShifts]
      })),

      updateShift: (id, updates) => set((state) => ({
        shifts: state.shifts.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteShift: (id) => set((state) => ({
        shifts: state.shifts.filter(s => s.id !== id)
      })),

      addRole: (role) => set((state) => ({
        roles: [...state.roles, role]
      })),

      updateRole: (id, updates) => set((state) => ({
        roles: state.roles.map(r => r.id === id ? { ...r, ...updates } : r)
      })),

      deleteRole: (id) => set((state) => {
        const roleToDelete = state.roles.find(r => r.id === id);
        if (!roleToDelete) return state;

        return {
          roles: state.roles.filter(r => r.id !== id),
          // Si el empleado tenía este rol, pasa a "Sin Rol"
          employees: state.employees.map(emp => 
            emp.role === roleToDelete.name ? { ...emp, role: 'Sin Rol' } : emp
          )
        };
      }),

      addShiftTemplate: (template) => set((state) => ({
        shiftTemplates: [...state.shiftTemplates, template]
      })),

      deleteShiftTemplate: (id) => set((state) => ({
        shiftTemplates: state.shiftTemplates.filter(t => t.id !== id)
      }))
    }),
    {
      name: 'brew-bites-storage',
    }
  )
);
