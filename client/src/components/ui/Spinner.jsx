// client/src/components/ui/Spinner.jsx

export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <svg
      className={`${sizes[size]} animate-spin text-white`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}


// afilarlo milimétricamente usando una tipografía un poco más compacta y en mayúsculas (text-xs uppercase tracking-wider font-semibold text-white/50), que encaja de forma magistral con el "look negro cine" de los inputs.
// export default function Spinner({ size = 'md' }) {
//   const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
//   return (
//     <svg
//       className={`${sizes[size]} animate-spin text-white`}
//       viewBox="0 0 24 24"
//       fill="none"
//     >
//       <circle
//         className="opacity-25"
//         cx="12" cy="12" r="10"
//         stroke="currentColor" strokeWidth="4"
//       />
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//       />
//     </svg>
//   )
// }
