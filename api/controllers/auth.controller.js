// api/controllers/auth.controller.js

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prismaClient.js'

// ─────────────────────────────────────────
// UTILIDAD — Genera un JWT firmado
// ─────────────────────────────────────────
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// ─────────────────────────────────────────
// UTILIDAD — Forma segura de devolver el usuario
// Nunca expongas passwordHash al cliente
// ─────────────────────────────────────────
const sanitizeUser = (user) => {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

// ─────────────────────────────────────────
// POST /api/auth/register
// Registro con email y contraseña
// ─────────────────────────────────────────
export const register = async (req, res) => {
  const { name, email, password } = req.body

  // 1. Validación básica de entrada
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Nombre, email y contraseña son obligatorios.',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      status: 'error',
      message: 'La contraseña debe tener al menos 8 caracteres.',
    })
  }

  try {
    // 2. Comprobar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Ya existe una cuenta con ese email.',
      })
    }

    // 3. Hashear la contraseña ANTES de tocar Prisma
    const SALT_ROUNDS = 12
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // 4. Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        provider: 'credentials',
      },
    })

    // 5. Generar token y responder
    const token = generateToken(newUser)

    return res.status(201).json({
      status: 'success',
      token,
      user: sanitizeUser(newUser),
    })
  } catch (err) {
    console.error('Error en register:', err)
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al crear el usuario.',
    })
  }
}

// ─────────────────────────────────────────
// POST /api/auth/login
// Login con email y contraseña
// ─────────────────────────────────────────
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email y contraseña son obligatorios.',
    })
  }

  try {
    // 1. Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    // 2. Mensaje genérico — nunca reveles si el email existe o no
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales incorrectas.',
      })
    }

    // 3. Comparar la contraseña con el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales incorrectas.',
      })
    }

    // 4. Generar token y responder
    const token = generateToken(user)

    return res.status(200).json({
      status: 'success',
      token,
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error('Error en login:', err)
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al iniciar sesión.',
    })
  }
}

// ─────────────────────────────────────────
// POST /api/auth/social
// Login social — Google o GitHub (token ya verificado en el cliente)
// El frontend envía los datos del perfil OAuth tras validarlos con el proveedor
// ─────────────────────────────────────────
export const socialLogin = async (req, res) => {
  const { name, email, provider, providerId } = req.body

  if (!email || !provider || !providerId) {
    return res.status(400).json({
      status: 'error',
      message: 'Datos OAuth incompletos.',
    })
  }

  try {
    // 1. Buscar si ya existe por proveedor+id (login recurrente)
    let user = await prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId: String(providerId),
        },
      },
    })

    // 2. Si no existe por OAuth, buscar por email (cuenta preexistente)
    if (!user) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      })

      if (existingByEmail) {
        // Vincular proveedor social a la cuenta existente
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            provider,
            providerId: String(providerId),
          },
        })
      } else {
        // 3. Crear nuevo usuario social (sin passwordHash)
        user = await prisma.user.create({
          data: {
            name: name?.trim() || email.split('@')[0],
            email: email.toLowerCase().trim(),
            provider,
            providerId: String(providerId),
            // passwordHash se omite — es nullable en el schema
          },
        })
      }
    }

    // 4. Generar token y responder
    const token = generateToken(user)

    return res.status(200).json({
      status: 'success',
      token,
      user: sanitizeUser(user),
    })
  } catch (err) {
    console.error('Error en socialLogin:', err)
    return res.status(500).json({
      status: 'error',
      message: 'Error interno en el login social.',
    })
  }
}

// ─────────────────────────────────────────
// GET /api/auth/me
// Devuelve el usuario autenticado a partir del token
// Ruta protegida — requiere middleware protect
// ─────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      // Excluir passwordHash explícitamente en la consulta
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        // passwordHash: false  ← omitido por defecto con select
      },
    })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado.',
      })
    }

    return res.status(200).json({
      status: 'success',
      user,
    })
  } catch (err) {
    console.error('Error en getMe:', err)
    return res.status(500).json({
      status: 'error',
      message: 'Error interno al obtener el usuario.',
    })
  }
}