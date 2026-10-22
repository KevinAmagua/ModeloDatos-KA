interface EstadoMutacion {
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  error: Error | null
  submittedAt: number
}

interface MutacionConMensaje {
  estado: EstadoMutacion
  mensajeExito: string
}

// Toma la última mutación finalizada para mostrar un único aviso coherente,
// evitando que un mensaje viejo tape el resultado de la operación actual.
export function useEstadosMutacion(mutaciones: MutacionConMensaje[]) {
  const isPending = mutaciones.some(({estado}) => estado.isPending)

  const ultima = mutaciones
    .filter(({estado}) => estado.isError || estado.isSuccess)
    .sort(
      (a, b) =>
        (b.estado.submittedAt ?? 0) - (a.estado.submittedAt ?? 0),
    )[0]

  if (!ultima) {
    return {
      isPending,
      isError: false,
      tipo: null as 'exito' | 'error' | null,
      mensaje: '',
    }
  }

  if (ultima.estado.isError) {
    return {
      isPending,
      isError: true,
      tipo: 'error' as const,
      mensaje:
        ultima.estado.error?.message ??
        'Ocurrió un error. Intenta nuevamente.',
    }
  }

  return {
    isPending,
    isError: false,
    tipo: 'exito' as const,
    mensaje: ultima.mensajeExito,
  }
}
