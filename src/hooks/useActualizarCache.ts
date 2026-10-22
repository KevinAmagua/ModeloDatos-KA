import {useQueryClient} from '@tanstack/react-query'
import type {Carro} from '@/types/carro'

export const CARROS_QUERY_KEY = ['carros']

export function useActualizarCache() {
  const queryClient = useQueryClient()

  const obtenerCarros = () => queryClient.getQueryData<Carro[]>(CARROS_QUERY_KEY)

  const cancelarConsultas = () =>
    queryClient.cancelQueries({queryKey: CARROS_QUERY_KEY})

  const restaurarCarros = (carros: Carro[]) =>
    queryClient.setQueryData<Carro[]>(CARROS_QUERY_KEY, carros)

  const actualizarCarro = (carroActualizado: Carro) =>
    queryClient.setQueryData<Carro[]>(CARROS_QUERY_KEY, (carros = []) =>
      carros.map((carro) =>
        carro.id === carroActualizado.id
          ? {...carro, ...carroActualizado}
          : carro,
      ),
    )

  const eliminarCarro = (id: string) =>
    queryClient.setQueryData<Carro[]>(CARROS_QUERY_KEY, (carros = []) =>
      carros.filter((carro) => carro.id !== id),
    )

  const invalidarCarros = () =>
    queryClient.invalidateQueries({queryKey: CARROS_QUERY_KEY})

  return {
    obtenerCarros,
    cancelarConsultas,
    restaurarCarros,
    actualizarCarro,
    eliminarCarro,
    invalidarCarros,
  }
}
