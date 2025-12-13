import { CloudinaryConfig } from './types';

// Parsed from CLOUDINARY_URL=cloudinary://164368975898265:4toK14OkJY-ePc-NFE_YsB2vrFc@dky6urpy2
// NOTE: In a production environment, the API Secret should NEVER be exposed on the client.
// This configuration is strictly for the requested demo architecture using client-side calls.
export const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: 'dky6urpy2',
  apiKey: '164368975898265',
  apiSecret: '4toK14OkJY-ePc-NFE_YsB2vrFc'
};

export const FILENAME = 'domains.json';