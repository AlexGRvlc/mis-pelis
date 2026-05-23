// client/src/components/ui/FormField.jsx

export default function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-body font-medium text-white/70">
          {label}
        </label>
      )}
      {children}
      {error && (
        <span className="text-xs text-rose-400 font-body">
          {error}
        </span>
      )}
    </div>
  )
}



// afilarlo milimétricamente usando una tipografía un poco más compacta y en mayúsculas (text-xs uppercase tracking-wider font-semibold text-white/50), que encaja de forma magistral con el "look negro cine" de los inputs.
// export default function FormField({ label, error, children }) {
//   return (
//     <div className="flex flex-col gap-1.5 w-full">
//       {label && (
//         <label className="text-xs font-body font-semibold uppercase tracking-wider text-white/50">
//           {label}
//         </label>
//       )}
//       {children}
//       {error && (
//         <span className="text-xs text-rose-400 font-body font-medium animate-in fade-in duration-150">
//           {error}
//         </span>
//       )}
//     </div>
//   )
// }


