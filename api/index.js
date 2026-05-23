// api/index.js
// ⚠️ Punto de entrada para Vercel Serverless Functions.
// Vercel importa este módulo y enruta las peticiones HTTP directamente
// a la instancia de Express. NUNCA uses app.listen() aquí.

import app from './app.js'

export default app