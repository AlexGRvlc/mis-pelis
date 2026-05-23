// api/lib/prismaClient.js

import { PrismaClient } from '@prisma/client'

// Patrón Singleton seguro para entornos Serverless.
// En producción, cada instancia de la función reutiliza la conexión existente.
// En desarrollo, evitamos crear un nuevo cliente en cada hot-reload de nodemon.

const globalForPrisma = globalThis

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma