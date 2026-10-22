import {useMutation} from '@tanstack/react-query'
import {carroService} from '@/api/carrito.service'
import {useActualizarCache} from '@/hooks/useActualizarCache'

export function useAgregarCarro() {
  const {invalidarCarros} = useActualizarCache()

  return useMutation({
    mutationFn: carroService.add,
    onSuccess: invalidarCarros,
  })
}
