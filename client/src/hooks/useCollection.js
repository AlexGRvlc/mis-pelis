// client/src/hooks/useCollection.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionService } from '../services/collection.service.js'
import toast from 'react-hot-toast'

export const useCollection = (status = null) => {
  const queryClient = useQueryClient()

  // ── Query principal ───────────────────────
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['collection', status],
    queryFn:  () => collectionService.getAll(status),
    staleTime: 1000 * 60 * 2,
  })

  // ── Mutación: cambiar estado ──────────────
  const updateMutation = useMutation({
    mutationFn: ({ entryId, newStatus }) =>
      collectionService.updateStatus(entryId, newStatus),

    // Actualización optimista — la UI responde al instante
    onMutate: async ({ entryId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['collection'] })
      const previous = queryClient.getQueryData(['collection', status])

      queryClient.setQueryData(['collection', status], (old) => {
        if (!old) return old
        return {
          ...old,
          results: old.results.map((entry) =>
            entry.id === entryId
              ? { ...entry, status: newStatus }
              : entry
          ),
        }
      })

      return { previous }
    },

    onError: (err, _, context) => {
      // Revertir si falla
      queryClient.setQueryData(['collection', status], context.previous)
      toast.error('No se pudo actualizar el estado.')
    },

    onSuccess: () => {
      toast.success('Estado actualizado.')
      queryClient.invalidateQueries({ queryKey: ['collection'] })
    },
  })

  // ── Mutación: eliminar ────────────────────
  const removeMutation = useMutation({
    mutationFn: (entryId) => collectionService.remove(entryId),

    onMutate: async (entryId) => {
      await queryClient.cancelQueries({ queryKey: ['collection'] })
      const previous = queryClient.getQueryData(['collection', status])

      // Eliminar optimistamente de la UI
      queryClient.setQueryData(['collection', status], (old) => {
        if (!old) return old
        return {
          ...old,
          total:   old.total - 1,
          results: old.results.filter((entry) => entry.id !== entryId),
        }
      })

      return { previous }
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(['collection', status], context.previous)
      toast.error('No se pudo eliminar la película.')
    },

    onSuccess: () => {
      toast.success('Película eliminada de tu colección.')
      queryClient.invalidateQueries({ queryKey: ['collection'] })
    },
  })

  return {
    entries:   data?.results || [],
    total:     data?.total   || 0,
    isLoading,
    isError,
    refetch,
    updateStatus: (entryId, newStatus) =>
      updateMutation.mutate({ entryId, newStatus }),
    remove:       (entryId) =>
      removeMutation.mutate(entryId),
    isUpdating:   updateMutation.isPending,
    isRemoving:   removeMutation.isPending,
  }
}