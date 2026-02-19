import {createClient} from '@supabase/supabase-js';

/**
 * Configuración de Supabase y Servicios de Datos.
 * 
 * inicializa la conexión con Supabase y exporta el cliente.
 * Además, define servicios auxiliares (tourService, stopService) para encapsular 
 * las operaciones CRUD, facilitando el acceso a datos desde cualquier parte de la app.
 * NOTA: Los servicios (tourService, stopService) NO se están usando, lo dejo por si lo uso mas adelante
 */
//mi proyecto en supabase
const SUPABASE_URL = 'https://zpmtdazhbpzjeojcldsr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZdkbhlnEyGDW9qBFiWjN4A_rVzrILbv';

//profe
//const SUPABASE_URL = 'https://jubpwowkvvpowkofrgoi.supabase.co';
//const SUPABASE_KEY = 'sb_publishable_UE3k9MPBZjuM9_p9iJxbAw_blznrAuo';

//creamos el cliente de supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CRUD para TOURS
export const tourService = {
  // CREATE: creaa un nuevo tour  
  create: async (tour: any) => await supabase.from('tours').insert([tour]).select(),
  // READ: obtener todos los tours 
  getAll: async () => await supabase.from('tours').select('*'),
  // UPDATE: actualizar un tour
  update: async (id: string, updates: any) => 
    await supabase.from('tours').update(updates).eq('id', id).select(),
  // DELETE: eliminar un tour 
  delete: async (id: string) => await supabase.from('tours').delete().eq('id', id)
};

// CRUD para STOPS
export const stopService = {
  // CREATE: crea un nuevo stop
  create: async (stop: any) => await supabase.from('stops').insert([stop]).select(),
  // READ: obtiene todos los stops de un tour específico
  getByTour: async (tourId: string) => 
    await supabase.from('stops').select('*').eq('tour_id', tourId).order('stop_order'),
  // UPDATE: actualiza un stop
  update: async (id: string, updates: any) => 
    await supabase.from('stops').update(updates).eq('id', id).select(),
  // DELETE: eliminar un stop
  delete: async (id: string) => await supabase.from('stops').delete().eq('id', id)
};


