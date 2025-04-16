// Database service for transponder data

export interface Transponder {
  id: number;
  name: string;
  utilizedBandwidth: number;
  totalBandwidth: number;
  frequencyBand: string;
  purpose: string;
  status: string;
}

const STORAGE_KEY = 'glimpse_transponder_data';

// Initial mock data
const initialTransponders: Transponder[] = [
  {
    id: 1,
    name: "Transponder A",
    utilizedBandwidth: 75.5,
    totalBandwidth: 100,
    frequencyBand: "C-Band Standard (5.925-6.425 GHz)",
    purpose: "Video Broadcasting",
    status: "Active",
  },
  {
    id: 2,
    name: "Transponder B",
    utilizedBandwidth: 45.2,
    totalBandwidth: 100,
    frequencyBand: "Ku-Band (12-18 GHz)",
    purpose: "Data Communication",
    status: "Active",
  },
  {
    id: 3,
    name: "Transponder C",
    utilizedBandwidth: 0,
    totalBandwidth: 100,
    frequencyBand: "C-Band Extended (6.425-7.075 GHz)",
    purpose: "Backup Channel",
    status: "Inactive",
  },
];

// Get all transponders
export const getAllTransponders = (): Transponder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize with default data if nothing exists
      saveAllTransponders(initialTransponders);
      return initialTransponders;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error retrieving transponder data:', error);
    return initialTransponders;
  }
};

// Save all transponders
export const saveAllTransponders = (transponders: Transponder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transponders));
  } catch (error) {
    console.error('Error saving transponder data:', error);
  }
};

// Add a new transponder
export const addTransponder = (transponder: Omit<Transponder, 'id'>): Transponder => {
  const transponders = getAllTransponders();
  const newId = transponders.length > 0 
    ? Math.max(...transponders.map(t => t.id)) + 1 
    : 1;
  
  const newTransponder = { ...transponder, id: newId };
  saveAllTransponders([...transponders, newTransponder]);
  return newTransponder;
};

// Update an existing transponder
export const updateTransponder = (updatedTransponder: Transponder): Transponder | null => {
  const transponders = getAllTransponders();
  const index = transponders.findIndex(t => t.id === updatedTransponder.id);
  
  if (index === -1) return null;
  
  transponders[index] = updatedTransponder;
  saveAllTransponders(transponders);
  return updatedTransponder;
};

// Delete a transponder
export const deleteTransponder = (id: number): boolean => {
  const transponders = getAllTransponders();
  const filteredTransponders = transponders.filter(t => t.id !== id);
  
  if (filteredTransponders.length === transponders.length) return false;
  
  saveAllTransponders(filteredTransponders);
  return true;
};

// Clear all data and reset to initial
export const resetToInitial = (): void => {
  saveAllTransponders(initialTransponders);
};

// Import data from CSV
export const importFromCSV = (data: Transponder[]): void => {
  saveAllTransponders(data);
};
