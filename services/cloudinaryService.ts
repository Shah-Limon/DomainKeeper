import { CLOUDINARY_CONFIG, FILENAME } from '../constants';
import { Domain } from '../types';
import { sha1 } from '../utils';

export const fetchDomains = async (): Promise<Domain[]> => {
  const { cloudName } = CLOUDINARY_CONFIG;
  // Use a cache-busting parameter to ensure we get the latest version
  const url = `https://res.cloudinary.com/${cloudName}/raw/upload/${FILENAME}?cb=${Date.now()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return []; // File doesn't exist yet, return empty list
      }
      throw new Error(`Failed to fetch domains: ${response.statusText}`);
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      // Ensure all loaded domains have a status, defaulting to 'pending' for backward compatibility
      return data.map((d: any) => ({
        ...d,
        status: d.status || 'pending'
      }));
    }
    return [];
  } catch (error) {
    console.warn("Could not fetch existing domains (might be first run):", error);
    return [];
  }
};

export const saveDomains = async (domains: Domain[]): Promise<void> => {
  const { cloudName, apiKey, apiSecret } = CLOUDINARY_CONFIG;
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Construct the signature string: parameters sorted alphabetically
  const paramsToSign = `public_id=${FILENAME}&timestamp=${timestamp}${apiSecret}`;
  const signature = await sha1(paramsToSign);

  const formData = new FormData();
  
  // Create a blob from the JSON data
  const jsonBlob = new Blob([JSON.stringify(domains, null, 2)], { type: 'application/json' });
  
  formData.append('file', jsonBlob, FILENAME);
  formData.append('public_id', FILENAME);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('resource_type', 'raw');

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || 'Upload failed');
  }
};