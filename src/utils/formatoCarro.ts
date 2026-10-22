import type {Carro} from '@/types/carro'

// Los registros antiguos de MockAPI solo tienen marca e id. Estas funciones
// evitan que la interfaz muestre "undefined" o falle con esos datos.
const textoNormalizado = (valor: string | undefined) =>
  typeof valor === 'string' ? valor.trim() : ''

export const textoODefecto = (valor: string | undefined) => {
  const texto = textoNormalizado(valor)
  return texto ? texto : 'Sin dato'
}

export const numeroODefecto = (valor: number | undefined) =>
  typeof valor === 'number' && Number.isFinite(valor)
    ? valor.toLocaleString('es-EC')
    : 'Sin dato'

export const precioODefecto = (valor: number | undefined) =>
  typeof valor === 'number' && Number.isFinite(valor)
    ? `$${valor.toLocaleString('es-EC')}`
    : 'Sin dato'

export const descripcionVehiculo = (carro: Carro) => {
  const partes = [carro.modelo, carro.año]
    .map((parte) => textoNormalizado(parte))
    .filter(Boolean)

  return partes.length ? partes.join(' · ') : 'Modelo y año sin dato'
}
