import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1c8fdeb2dd314d4d84b35d479b4e46d3',
  appName: 'Toca da Onça Agente',
  webDir: 'dist',
  server: {
    url: 'https://1c8fdeb2-dd31-4d4d-84b3-5d479b4e46d3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: true,
      spinnerColor: '#f97316'
    }
  }
};

export default config;
