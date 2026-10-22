import {useQuery} from '@tanstack/react-query'
import {carroService} from '@/api/carrito.service'
import {CARROS_QUERY_KEY} from '@/hooks/useActualizarCache'

export function useCarros() {
  return useQuery({
    queryKey: CARROS_QUERY_KEY,
    queryFn: carroService.getAll,
    // Los datos se consideran frescos durante 5 minutos.
    staleTime: 1000 * 60 * 5,
  })
}
