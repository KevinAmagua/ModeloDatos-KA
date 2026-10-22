import {useMutation} from '@tanstack/react-query'
import {
  carroService,
  type ActualizacionCarro,
} from '@/api/carrito.service'
import {useActualizarCache} from '@/hooks/useActualizarCache'

export interface EdicionCarro {
  id: string
  carro: ActualizacionCarro
}

export function useEditarCarro() {
  const {actualizarCarro, invalidarCarros} = useActualizarCache()

  return useMutation({
    mutationFn: ({id, carro}: EdicionCarro) => carroService.update(id, carro),
    // setQueryData actualiza la ficha al instante, sin recargar la pantalla.
    onSuccess: actualizarCarro,
    // Después confirmamos contra el servidor en segundo plano.
    onSettled: () => invalidarCarros(),
  })
}
