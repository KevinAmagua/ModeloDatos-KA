import {useRef, useState} from 'react';
import {KeyboardAvoidingView, FlatList, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GlassView} from 'expo-glass-effect';
import {useForm} from '@tanstack/react-form';
import type {Carro} from '@/types/carro';
import type {NuevoCarro} from '@/api/carrito.service';
import {useCarros} from '@/hooks/useCarros';
import {useAgregarCarro} from '@/hooks/useAgregarCarro';
import {useEditarCarro} from '@/hooks/useEditarCarro';
import {useEliminarCarro} from '@/hooks/useEliminarCarro';
import {useEstadosMutacion} from '@/hooks/useEstadosMutacion';
import {ActionButton} from '@/components/ActionButton';
import {
  descripcionVehiculo,
  numeroODefecto,
  precioODefecto,
  textoODefecto,
} from '@/utils/formatoCarro';

interface ValoresFormularioCarro {
  marca: string;
  año: string;
  modelo: string;
  color: string;
  precio: string;
  kilometraje: string;
}

const carroVacio: ValoresFormularioCarro = {
  marca: '',
  año: '',
  modelo: '',
  color: '',
  precio: '',
  kilometraje: '',
}

const anioMaximo = new Date().getFullYear() + 1

const textoNormalizado = (valor: string | undefined) =>
  typeof valor === 'string' ? valor.trim() : ''

// Validadores compartidos por cada campo y por el estado del botón Guardar.
const validarObligatorio = (valor: string | undefined) =>
  textoNormalizado(valor) ? undefined : 'Este campo es obligatorio.'

const validarAnio = (valor: string | undefined) => {
  const texto = textoNormalizado(valor)
  if (!texto) return 'Este campo es obligatorio.'

  const anio = Number(texto)
  if (!/^\d{4}$/.test(texto) || !Number.isInteger(anio) || anio < 1886 || anio > anioMaximo) {
    return `Ingresa un año entre 1886 y ${anioMaximo}.`
  }
}

const validarMayorACero = (valor: string | undefined, etiqueta: string) => {
  const texto = textoNormalizado(valor)
  if (!texto) return 'Este campo es obligatorio.'

  // Acepta coma o punto decimal, según el teclado del dispositivo.
  const numero = Number(texto.replace(',', '.'))
  if (!Number.isFinite(numero) || numero <= 0) return `${etiqueta} debe ser mayor que 0.`
}

// En edición los campos no son obligatorios: solo se valida el formato
// de los que el usuario haya llenado.
const validarAnioOpcional = (valor: string | undefined) => {
  if (!textoNormalizado(valor)) return undefined
  return validarAnio(valor)
}

const validarMayorACeroOpcional = (valor: string | undefined, etiqueta: string) => {
  if (!textoNormalizado(valor)) return undefined
  return validarMayorACero(valor, etiqueta)
}

const formularioEsValido = (valores: ValoresFormularioCarro, esEdicion: boolean) => {
  const validarTexto = (valor: string) =>
    esEdicion ? undefined : validarObligatorio(valor)

  const validarAnioSegunModo = (valor: string) =>
    esEdicion ? validarAnioOpcional(valor) : validarAnio(valor)

  const validarNumeroSegunModo = (valor: string, etiqueta: string) =>
    esEdicion
      ? validarMayorACeroOpcional(valor, etiqueta)
      : validarMayorACero(valor, etiqueta)

  return (
    validarTexto(valores.marca) === undefined &&
    validarAnioSegunModo(valores.año) === undefined &&
    validarTexto(valores.modelo) === undefined &&
    validarTexto(valores.color) === undefined &&
    validarNumeroSegunModo(valores.precio, 'El precio') === undefined &&
    validarNumeroSegunModo(valores.kilometraje, 'El kilometraje') === undefined
  )
}

const construirCarroCompleto = (valores: ValoresFormularioCarro): NuevoCarro => ({
  marca: valores.marca.trim(),
  año: valores.año.trim(),
  modelo: valores.modelo.trim(),
  color: valores.color.trim(),
  precio: Number(valores.precio.replace(',', '.').trim()),
  kilometraje: Number(valores.kilometraje.replace(',', '.').trim()),
})

// Al editar enviamos solo los campos con valor para poder actualizar uno solo
// sin borrar los demás datos del carro.
const construirCambios = (valores: ValoresFormularioCarro): Partial<NuevoCarro> => {
  const cambios: Partial<NuevoCarro> = {}
  const marca = valores.marca.trim()
  const anio = valores.año.trim()
  const modelo = valores.modelo.trim()
  const color = valores.color.trim()
  const precio = valores.precio.replace(',', '.').trim()
  const kilometraje = valores.kilometraje.replace(',', '.').trim()

  if (marca) cambios.marca = marca
  if (anio) cambios.año = anio
  if (modelo) cambios.modelo = modelo
  if (color) cambios.color = color
  if (precio) cambios.precio = Number(precio)
  if (kilometraje) cambios.kilometraje = Number(kilometraje)

  return cambios
}

export default function App() {
  const listRef = useRef<FlatList<Carro>>(null)
  const [idCarroEditando, setIdCarroEditando] = useState<string | null>(null)
  const [mostrarErroresFormulario, setMostrarErroresFormulario] = useState(false)
  const [campoEnfocado, setCampoEnfocado] = useState<string | null>(null)
  const {data:carros = [], isLoading,error} = useCarros()
  const agregarMutation = useAgregarCarro()
  const editarMutation = useEditarCarro()
  const eliminarMutation = useEliminarCarro()
  const estadoMutaciones = useEstadosMutacion([
    {estado: agregarMutation, mensajeExito: 'Carro agregado correctamente.'},
    {estado: editarMutation, mensajeExito: 'Carro actualizado correctamente.'},
    {estado: eliminarMutation, mensajeExito: 'Carro eliminado correctamente.'},
  ])

  // TanStack Form mantiene los valores como texto para controlar los inputs;
  // al enviar, convierte precio y kilometraje al tipo numérico del modelo.
  const form = useForm({
    defaultValues: carroVacio,
    onSubmit: async ({value}) => {
      try {
        if (idCarroEditando) {
          const cambios = construirCambios(value)

          if (Object.keys(cambios).length === 0) {
            setIdCarroEditando(null)
            form.reset(carroVacio)
            return
          }

          await editarMutation.mutateAsync({id: idCarroEditando, carro: cambios})
          setIdCarroEditando(null)
        } else {
          await agregarMutation.mutateAsync(construirCarroCompleto(value))
        }

        form.reset(carroVacio)
        setMostrarErroresFormulario(false)
      } catch {
        // El hook de la mutación ya expone isError y su mensaje.
        // Capturamos la promesa para evitar un rechazo sin manejar.
      }
    },
  })

  const editar = (carroActual: Carro) => {
    form.reset({
      marca: carroActual.marca ?? '',
      año: carroActual.año ?? '',
      modelo: carroActual.modelo ?? '',
      color: carroActual.color ?? '',
      precio: carroActual.precio == null ? '' : String(carroActual.precio),
      kilometraje: carroActual.kilometraje == null ? '' : String(carroActual.kilometraje),
    })
    setIdCarroEditando(carroActual.id)
    setMostrarErroresFormulario(false)
    listRef.current?.scrollToOffset({offset: 0, animated: true})
  }

  const cancelarEdicion = () => {
    form.reset(carroVacio)
    setIdCarroEditando(null)
    setMostrarErroresFormulario(false)
  }

  const guardando = agregarMutation.isPending || editarMutation.isPending

  if(isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Cargando vehículos</Text>
          <Text style={styles.stateText}>Estamos preparando tu inventario.</Text>
        </View>
      </SafeAreaView>
    )
  }
  if(error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.stateCard, styles.errorCard]}>
          <Text style={styles.stateTitle}>No se pudo cargar</Text>
          <Text style={styles.stateText}>{error.message}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return(
    <SafeAreaView style={styles.screen}>
      <View pointerEvents="none" style={styles.ambientGlow}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={listRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          data={carros}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <View style={styles.pageHeader}>
                <Text style={styles.eyebrow}>GESTIÓN DE INVENTARIO</Text>
                <Text style={styles.pageTitle}>Tus vehículos</Text>
                <Text style={styles.pageSubtitle}>Registra y administra tu colección.</Text>
              </View>
              <GlassView glassEffectStyle="regular" style={styles.formCard}>
                <Text style={styles.sectionTitle}>
                  {idCarroEditando ? 'Editar vehículo' : 'Agregar vehículo'}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {idCarroEditando
                    ? 'Modifica solo los campos que necesites; los demás no son obligatorios.'
                    : 'Completa los datos del automóvil'}
                </Text>

                {/* TanStack Form valida cada campo y muestra sus errores junto
                    al input apenas el campo es tocado o se intenta guardar. */}
                <form.Field name="marca" validators={{
                  onChange: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                  onBlur: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                  onSubmit: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                }}>
                  {(field) => (
                    <View style={styles.field}>
                      <Text style={styles.label}>Marca</Text>
                      <TextInput
                        accessibilityLabel="Marca"
                        placeholder="Ej. Toyota"
                        placeholderTextColor="#9E9EA7"
                        selectionColor="#E31B23"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setCampoEnfocado('marca')}
                        onBlur={() => {
                          field.handleBlur()
                          setCampoEnfocado(null)
                        }}
                        style={[styles.input, campoEnfocado === 'marca' && styles.inputFocused]}
                      />
                      {(field.state.meta.isTouched || mostrarErroresFormulario) &&
                        field.state.meta.errors.length > 0 && (
                          <Text style={styles.fieldError}>{String(field.state.meta.errors[0])}</Text>
                        )}
                    </View>
                  )}
                </form.Field>
                <form.Field name="año" validators={{
                  onChange: ({value}) => idCarroEditando ? validarAnioOpcional(value) : validarAnio(value),
                  onBlur: ({value}) => idCarroEditando ? validarAnioOpcional(value) : validarAnio(value),
                  onSubmit: ({value}) => idCarroEditando ? validarAnioOpcional(value) : validarAnio(value),
                }}>
                  {(field) => (
                    <View style={styles.field}>
                      <Text style={styles.label}>Año</Text>
                      <TextInput
                        accessibilityLabel="Año"
                        placeholder={`1886–${anioMaximo}`}
                        placeholderTextColor="#9E9EA7"
                        selectionColor="#E31B23"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setCampoEnfocado('año')}
                        onBlur={() => {
                          field.handleBlur()
                          setCampoEnfocado(null)
                        }}
                        keyboardType="number-pad"
                        maxLength={4}
                        style={[styles.input, campoEnfocado === 'año' && styles.inputFocused]}
                      />
                      {(field.state.meta.isTouched || mostrarErroresFormulario) &&
                        field.state.meta.errors.length > 0 && (
                          <Text style={styles.fieldError}>{String(field.state.meta.errors[0])}</Text>
                        )}
                    </View>
                  )}
                </form.Field>
                <form.Field name="modelo" validators={{
                  onChange: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                  onBlur: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                  onSubmit: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                }}>
                  {(field) => (
                    <View style={styles.field}>
                      <Text style={styles.label}>Modelo</Text>
                      <TextInput
                        accessibilityLabel="Modelo"
                        placeholder="Ej. Corolla"
                        placeholderTextColor="#9E9EA7"
                        selectionColor="#E31B23"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setCampoEnfocado('modelo')}
                        onBlur={() => {
                          field.handleBlur()
                          setCampoEnfocado(null)
                        }}
                        style={[styles.input, campoEnfocado === 'modelo' && styles.inputFocused]}
                      />
                      {(field.state.meta.isTouched || mostrarErroresFormulario) &&
                        field.state.meta.errors.length > 0 && (
                          <Text style={styles.fieldError}>{String(field.state.meta.errors[0])}</Text>
                        )}
                    </View>
                  )}
                </form.Field>
                <form.Field name="color" validators={{
                  onChange: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                  onBlur: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                  onSubmit: ({value}) => idCarroEditando ? undefined : validarObligatorio(value),
                }}>
                  {(field) => (
                    <View style={styles.field}>
                      <Text style={styles.label}>Color</Text>
                      <TextInput
                        accessibilityLabel="Color"
                        placeholder="Ej. Gris"
                        placeholderTextColor="#9E9EA7"
                        selectionColor="#E31B23"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setCampoEnfocado('color')}
                        onBlur={() => {
                          field.handleBlur()
                          setCampoEnfocado(null)
                        }}
                        style={[styles.input, campoEnfocado === 'color' && styles.inputFocused]}
                      />
                      {(field.state.meta.isTouched || mostrarErroresFormulario) &&
                        field.state.meta.errors.length > 0 && (
                          <Text style={styles.fieldError}>{String(field.state.meta.errors[0])}</Text>
                        )}
                    </View>
                  )}
                </form.Field>
                <form.Field name="precio" validators={{
                  onChange: ({value}) => idCarroEditando
                    ? validarMayorACeroOpcional(value, 'El precio')
                    : validarMayorACero(value, 'El precio'),
                  onBlur: ({value}) => idCarroEditando
                    ? validarMayorACeroOpcional(value, 'El precio')
                    : validarMayorACero(value, 'El precio'),
                  onSubmit: ({value}) => idCarroEditando
                    ? validarMayorACeroOpcional(value, 'El precio')
                    : validarMayorACero(value, 'El precio'),
                }}>
                  {(field) => (
                    <View style={styles.field}>
                      <Text style={styles.label}>Precio</Text>
                      <TextInput
                        accessibilityLabel="Precio"
                        placeholder="0.00"
                        placeholderTextColor="#9E9EA7"
                        selectionColor="#E31B23"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setCampoEnfocado('precio')}
                        onBlur={() => {
                          field.handleBlur()
                          setCampoEnfocado(null)
                        }}
                        keyboardType="decimal-pad"
                        style={[styles.input, campoEnfocado === 'precio' && styles.inputFocused]}
                      />
                      {(field.state.meta.isTouched || mostrarErroresFormulario) &&
                        field.state.meta.errors.length > 0 && (
                          <Text style={styles.fieldError}>{String(field.state.meta.errors[0])}</Text>
                        )}
                    </View>
                  )}
                </form.Field>
                <form.Field name="kilometraje" validators={{
                  onChange: ({value}) => idCarroEditando
                    ? validarMayorACeroOpcional(value, 'El kilometraje')
                    : validarMayorACero(value, 'El kilometraje'),
                  onBlur: ({value}) => idCarroEditando
                    ? validarMayorACeroOpcional(value, 'El kilometraje')
                    : validarMayorACero(value, 'El kilometraje'),
                  onSubmit: ({value}) => idCarroEditando
                    ? validarMayorACeroOpcional(value, 'El kilometraje')
                    : validarMayorACero(value, 'El kilometraje'),
                }}>
                  {(field) => (
                    <View style={styles.field}>
                      <Text style={styles.label}>Kilometraje</Text>
                      <TextInput
                        accessibilityLabel="Kilometraje"
                        placeholder="Ej. 25000"
                        placeholderTextColor="#9E9EA7"
                        selectionColor="#E31B23"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onFocus={() => setCampoEnfocado('kilometraje')}
                        onBlur={() => {
                          field.handleBlur()
                          setCampoEnfocado(null)
                        }}
                        keyboardType="decimal-pad"
                        style={[styles.input, campoEnfocado === 'kilometraje' && styles.inputFocused]}
                      />
                      {(field.state.meta.isTouched || mostrarErroresFormulario) &&
                        field.state.meta.errors.length > 0 && (
                          <Text style={styles.fieldError}>{String(field.state.meta.errors[0])}</Text>
                        )}
                    </View>
                  )}
                </form.Field>

                {!!estadoMutaciones.mensaje && (
                  <Text
                    accessibilityLiveRegion="polite"
                    style={[
                      styles.feedback,
                      estadoMutaciones.isError ? styles.errorText : styles.successText,
                    ]}
                  >
                    {estadoMutaciones.isError ? 'Error: ' : ''}
                    {estadoMutaciones.mensaje}
                  </Text>
                )}
                <form.Subscribe
                  selector={(state) => ({
                    values: state.values,
                    isSubmitting: state.isSubmitting,
                    canSubmit: state.canSubmit,
                  })}
                >
                  {({values, isSubmitting, canSubmit}) => {
                    const enviando = isSubmitting || guardando
                    const valido = formularioEsValido(values, Boolean(idCarroEditando))

                    return (
                      <ActionButton
                        title={
                          enviando
                            ? 'Guardando...'
                            : idCarroEditando ? 'Guardar cambios' : 'Agregar vehículo'
                        }
                        onPress={() => {
                          setMostrarErroresFormulario(true)
                          void form.handleSubmit()
                        }}
                        disabled={!valido || !canSubmit || enviando || eliminarMutation.isPending}
                        loading={enviando}
                      />
                    )
                  }}
                </form.Subscribe>
                {!!idCarroEditando && (
                  <View style={styles.cancelButton}>
                    <ActionButton
                      title="Cancelar edición"
                      onPress={cancelarEdicion}
                      disabled={guardando || eliminarMutation.isPending}
                      variant="secondary"
                    />
                  </View>
                )}
              </GlassView>

              <View style={styles.listHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Inventario</Text>
                  <Text style={styles.sectionSubtitle}>{carros.length} vehículos registrados</Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{carros.length}</Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Aún no hay vehículos</Text>
              <Text style={styles.stateText}>Agrega el primero usando el formulario.</Text>
            </View>
          }
          renderItem={({item}) => {
            const eliminando =
              eliminarMutation.isPending && eliminarMutation.variables === item.id

            return (
              <GlassView glassEffectStyle="regular" style={styles.carCard}>
                <View style={styles.carHeader}>
                  <View style={styles.carTitleGroup}>
                    <Text style={styles.carMake}>{textoODefecto(item.marca)}</Text>
                    <Text style={styles.carModel}>{descripcionVehiculo(item)}</Text>
                  </View>
                  <Text style={styles.price}>{precioODefecto(item.precio)}</Text>
                </View>
                <View style={styles.carDetails}>
                  <Text style={styles.detailLabel}>COLOR</Text>
                  <Text style={styles.detailValue}>{textoODefecto(item.color)}</Text>
                  <Text style={styles.detailLabel}>KM</Text>
                  <Text style={styles.detailValue}>{numeroODefecto(item.kilometraje)}</Text>
                  <Text style={styles.detailLabel}>ID</Text>
                  <Text style={styles.detailValue}>{item.id}</Text>
                </View>
                <View style={styles.carActions}>
                  <View style={styles.actionCell}>
                    <ActionButton
                      title="Editar"
                      onPress={() => editar(item)}
                      disabled={guardando || eliminarMutation.isPending}
                      variant="secondary"
                    />
                  </View>
                  <View style={styles.actionCell}>
                    <ActionButton
                      title={eliminando ? 'Eliminando...' : 'Eliminar'}
                      onPress={() => eliminarMutation.confirmarEliminacion(item)}
                      disabled={guardando || eliminarMutation.isPending}
                      loading={eliminando}
                      variant="danger"
                    />
                  </View>
                </View>
              </GlassView>
            )
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0E12',
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(227, 27, 35, 0.16)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(227, 27, 35, 0.1)',
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  pageHeader: {
    marginBottom: 22,
  },
  eyebrow: {
    color: '#FF4D55',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    color: '#9E9EA7',
    fontSize: 14,
    marginTop: 6,
  },
  formCard: {
    padding: 20,
    marginBottom: 28,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.25)',
    shadowColor: '#E31B23',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#9E9EA7',
    fontSize: 13,
    marginTop: 5,
  },
  field: {
    marginTop: 16,
  },
  label: {
    color: '#9E9EA7',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: '#181A20',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.2)',
    color: '#FFFFFF',
    fontSize: 15,
  },
  inputFocused: {
    borderColor: '#E31B23',
    backgroundColor: '#1E2027',
  },
  fieldError: {
    color: '#FF4D55',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  feedback: {
    fontSize: 13,
    marginTop: 14,
    marginBottom: 12,
    lineHeight: 19,
  },
  errorText: {
    color: '#FF4D55',
  },
  successText: {
    color: '#4ADE80',
  },
  cancelButton: {
    marginTop: 10,
  },
  listHeader: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countBadge: {
    minWidth: 38,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 27, 35, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.32)',
  },
  countText: {
    color: '#FF4D55',
    fontWeight: '700',
  },
  carCard: {
    padding: 18,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.2)',
    shadowColor: '#E31B23',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  carTitleGroup: {
    flex: 1,
    marginRight: 12,
  },
  carMake: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  carModel: {
    color: '#9E9EA7',
    fontSize: 13,
    marginTop: 4,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  carDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  detailLabel: {
    color: '#C4C9D4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 6,
  },
  detailValue: {
    color: '#C4C9D4',
    fontSize: 12,
    marginRight: 16,
  },
  carActions: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: -4,
  },
  actionCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  emptyCard: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#181A20',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.2)',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  stateCard: {
    margin: 20,
    padding: 22,
    borderRadius: 20,
    backgroundColor: '#181A20',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  stateText: {
    color: '#9E9EA7',
    fontSize: 14,
    lineHeight: 20,
  },
  errorCard: {
    borderColor: 'rgba(227, 27, 35, 0.4)',
  },
})
