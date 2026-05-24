// // client/src/hooks/useGoogleAuth.js

// import { useGoogleLogin } from '@react-oauth/google'
// import { useAuth } from '../context/AuthContext.jsx'
// import toast from 'react-hot-toast'
// import { useNavigate } from 'react-router-dom'

// export const useGoogleAuth = () => {
//   const { socialLogin } = useAuth()
//   const navigate        = useNavigate()

//   const loginWithGoogle = useGoogleLogin({
//     // 1. Google devuelve un access_token — lo usamos para obtener el perfil
//     onSuccess: async (tokenResponse) => {
//       try {
//         // 2. Obtener datos del perfil desde la API de Google
//         const profileRes = await fetch(
//           'https://www.googleapis.com/oauth2/v3/userinfo',
//           {
//             headers: {
//               Authorization: `Bearer ${tokenResponse.access_token}`,
//             },
//           }
//         )

//         if (!profileRes.ok) throw new Error('No se pudo obtener el perfil de Google.')

//         const profile = await profileRes.json()

//         // 3. Llamar al backend con los datos del perfil
//         await socialLogin({
//           name:       profile.name,
//           email:      profile.email,
//           provider:   'google',
//           providerId: profile.sub,       // 'sub' es el ID único de Google
//         })

//         toast.success(`¡Bienvenido, ${profile.name.split(' ')[0]}!`)
//         navigate('/')
//       } catch (err) {
//         const message = err.response?.data?.message || 'Error al iniciar sesión con Google.'
//         toast.error(message)
//       }
//     },

//     onError: () => {
//       toast.error('Login con Google cancelado o fallido.')
//     },
//   })

//   return { loginWithGoogle }
// }



// client/src/hooks/useGoogleAuth.js

import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const useGoogleAuth = () => {
  const { socialLogin } = useAuth()
  const navigate        = useNavigate()

  const loginWithGoogle = useGoogleLogin({
    // 1. Google devuelve un access_token — lo usamos para obtener el perfil
    onSuccess: async (tokenResponse) => {
      try {
        // 2. Obtener datos del perfil desde la API de Google
        const profileRes = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        )

        if (!profileRes.ok) throw new Error('No se pudo obtener el perfil de Google.')

        const profile = await profileRes.json()

        // 3. Llamar al backend con los datos del perfil
        await socialLogin({
          name:       profile.name,
          email:      profile.email,
          provider:   'google',
          providerId: profile.sub,       // 'sub' es el ID único de Google
        })

        toast.success(`¡Bienvenido, ${profile.name.split(' ')[0]}!`)
        navigate('/')
      } catch (err) {
        // Corregido: se adapta tanto si socialLogin usa Axios por detrás como si usa Fetch
        const message = err.response?.data?.message || err.message || 'Error al iniciar sesión con Google.'
        toast.error(message)
      }
    },

    onError: () => {
      toast.error('Login con Google cancelado o fallido.')
    },
  })

  return { loginWithGoogle }
}
