import { createContext, useContext, useCallback, useState } from 'react';
import appointmentService from '../services/appointmentService';
import patientService from '../services/patientService';

// Contexto mínimo para sincronizar pacientes e sessões entre páginas
const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  // Armazena compromissos por mês (chave AAAA-MM) para evitar refetch desnecessário
  const [appointmentsByMonth, setAppointmentsByMonth] = useState({});

  const refreshPatients = useCallback(async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data || []);
      return data;
    } catch (e) {
      console.error('Erro ao carregar pacientes:', e);
      setPatients([]);
      return [];
    }
  }, []);

  const refreshAppointmentsForMonth = useCallback(async (year, month) => {
    try {
      const data = await appointmentService.getByMonth(year, month);
      const key = `${year}-${String(month).padStart(2, '0')}`;
      const arr = Array.isArray(data) ? data : (data?.appointments || data?.data || []);
      setAppointmentsByMonth(prev => ({ ...prev, [key]: arr }));
      return arr;
    } catch (e) {
      console.error('Erro ao carregar sessões:', e);
      return [];
    }
  }, []);

  // Helpers CRUD para sessões que disparam atualização automática
  const createAppointment = useCallback(async (payload, year, month) => {
    const created = await appointmentService.create(payload);
    await refreshAppointmentsForMonth(year, month);
    return created;
  }, [refreshAppointmentsForMonth]);

  const updateAppointment = useCallback(async (id, payload, year, month) => {
    const updated = await appointmentService.update(id, payload);
    await refreshAppointmentsForMonth(year, month);
    return updated;
  }, [refreshAppointmentsForMonth]);

  const cancelAppointment = useCallback(async (id, year, month) => {
    const cancelled = await appointmentService.cancel(id);
    await refreshAppointmentsForMonth(year, month);
    return cancelled;
  }, [refreshAppointmentsForMonth]);

  const value = {
    patients,
    appointmentsByMonth,
    refreshPatients,
    refreshAppointmentsForMonth,
    createAppointment,
    updateAppointment,
    cancelAppointment,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext deve ser usado dentro de DataProvider');
  return ctx;
};
