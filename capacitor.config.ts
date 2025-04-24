import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.parkmatch.app',
  appName: 'ParkMatch',
  webDir: 'out',
  // Elimina la línea bundledWebRuntime: false
  // En su lugar, puedes usar estas propiedades si necesitas configuración adicional:
  server: {
    androidScheme: 'https'
  }
};

export default config;