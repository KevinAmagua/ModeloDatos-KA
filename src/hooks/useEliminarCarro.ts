import {Alert, Platform} from 'react-native'
import {useMutation} from '@tanstack/react-query'
import type {Carro} from '@/types/carro'
import {carroService} from '@/api/carrito.service'
import {useActualizarCache} from '@/hooks/useActualizarCache'

const mostrarError = (mensaje: string) => {
  // En web Alert.alert no hace nada, así que usamos el diálogo del navegador.
  if (Platform.OS === 'web') {
    const alertar = (globalThis as {alert?: (texto: string) => void}).alert
    alertar?.(`No se pudo eliminar el carro. ${mensaje}`)
    return
  }

  Alert.alert('No se pudo eliminar el carro', mensaje)
}

export function useEliminarCarro() {
  const {
    cancelarConsultas,
    obtenerCarros,
    eliminarCarro,
    restaurarCarros,
    invalidarCarros,
  } = useActualizarCache()

  const mutation = useMutation({
    mutationFn: carroService.remove,
    // Actualización optimista: el carro desaparece antes de la respuesta del servidor.
    onMutate: async (id) => {
      await cancelarConsultas()
      const carrosPrevios = obtenerCarros()
      eliminarCarro(id)
      return {carrosPrevios}
    },
    // Si falla, restauramos la lista anterior y avisamos al usuario.
    onError: (error, _id, contexto) => {
      if (contexto?.carrosPrevios) {
        restaurarCarros(contexto.carrosPrevios)
      }
      mostrarError(error.message)
    },
    // Al terminar (éxito o error), sincronizamos con el servidor.
    onSettled: () => invalidarCarros(),
  })

  const confirmarEliminacion = (carro: Carro) => {
    const mensaje = `¿Seguro que deseas eliminar el carro ${carro.marca} ${carro.modelo ?? ''}?`

    if (Platform.OS === 'web') {
      const confirmar = (
        globalThis as {confirm?: (texto: string) => boolean}
      ).confirm

      if (confirmar?.(mensaje)) {
        mutation.mutate(carro.id)
      }
      return
    }

    Alert.alert('Eliminar carro', mensaje, [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => mutation.mutate(carro.id),
      },
    ])
  }

  return {...mutation, confirmarEliminacion}
}
