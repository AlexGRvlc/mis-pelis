// api/middlewares/auth.middleware.js

import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  try {
    // 1. Extraer el token de la cabecera Authorization: Bearer <token>
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No autenticado. Proporciona un token válido.',
      })
    }

    const token = authHeader.split(' ')[1]

    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. Adjuntar el payload al objeto request para los controladores
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    }

    next()
  } catch (err) {
    // Token expirado
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Sesión expirada. Inicia sesión de nuevo.',
      })
    }

    // Token manipulado o inválido
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido.',
    })
  }
}