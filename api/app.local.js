// api/app.local.js
// Úsalo SOLO en desarrollo local con: npm run dev
// Este archivo NO se despliega en Vercel.

import app from './app.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────┐
  │   🎬 Mis Pelis API — Modo Desarrollo    │
  │   Servidor:  http://localhost:${PORT}       │
  │   Entorno:   ${process.env.NODE_ENV}            │
  └─────────────────────────────────────────┘
  `)
})