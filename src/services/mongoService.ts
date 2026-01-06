import { Domain } from '../types';

// Access the environment variable defined in your hosting provider or .env file
// If not defined, it falls back to the local proxy path
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/domains';

export const fetchDomains = async (): Promise<Domain[]> => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch domains from MongoDB:", error);
    throw error; // Propagate error to let App.tsx handle UI feedback
  }
};

export const saveDomains = async (domains: Domain[]): Promise<void> => {
  // Construct the sync URL. 
  // If BASE_URL is ".../api/domains", we append "/sync"
  const url = `${BASE_URL}/sync`; 

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(domains),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || 'Sync failed');
  }
};