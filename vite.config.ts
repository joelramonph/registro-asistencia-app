import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env en la raíz del proyecto
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Expone la variable de entorno API_KEY al código del cliente
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
