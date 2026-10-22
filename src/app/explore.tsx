import {FlatList, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GlassView} from 'expo-glass-effect';
import { useCarros } from "@/hooks/useCarros";
import {
  descripcionVehiculo,
  numeroODefecto,
  precioODefecto,
  textoODefecto,
} from '@/utils/formatoCarro';

export default function Explore(){
  const {data: carros = [], isLoading, error} = useCarros()

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Cargando vehículos</Text>
          <Text style={styles.stateText}>Actualizando la colección.</Text>
        </View>
      </SafeAreaView>
    )
  }
  if (error) {
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
      <FlatList
        contentContainerStyle={styles.listContent}
        data={carros}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.pageHeader}>
            <Text style={styles.eyebrow}>TU COLECCIÓN</Text>
            <View style={styles.headingRow}>
              <View style={styles.titleGroup}>
                <Text style={styles.pageTitle}>Vehículos</Text>
                <Text style={styles.pageSubtitle}>Consulta los detalles de tu inventario.</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{carros.length}</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Tu colección está vacía</Text>
            <Text style={styles.stateText}>Los vehículos que agregues aparecerán aquí.</Text>
          </View>
        }
        renderItem={({item}) => (
          <GlassView glassEffectStyle="regular" style={styles.carCard}>
            <View style={styles.carHeader}>
              <View style={styles.carTitleGroup}>
                <Text style={styles.carMake}>{textoODefecto(item.marca)}</Text>
                <Text style={styles.carModel}>{descripcionVehiculo(item)}</Text>
              </View>
              <Text style={styles.price}>{precioODefecto(item.precio)}</Text>
            </View>
            <View style={styles.carDetails}>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>COLOR</Text>
                <Text style={styles.detailValue}>{textoODefecto(item.color)}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>IDENTIFICADOR</Text>
                <Text style={styles.detailValue}>{item.id}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>KILOMETRAJE</Text>
                <Text style={styles.detailValue}>
                  {item.kilometraje == null
                    ? 'Sin dato'
                    : `${numeroODefecto(item.kilometraje)} km`}
                </Text>
              </View>
            </View>
          </GlassView>
        )}
      />
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
    marginBottom: 10,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flex: 1,
    marginRight: 14,
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
  countBadge: {
    minWidth: 42,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 27, 35, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.32)',
  },
  countText: {
    color: '#FF4D55',
    fontSize: 15,
    fontWeight: '700',
  },
  carCard: {
    padding: 19,
    marginBottom: 13,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.2)',
    shadowColor: '#E31B23',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
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
    fontSize: 19,
    fontWeight: '700',
  },
  carModel: {
    color: '#9E9EA7',
    fontSize: 14,
    marginTop: 5,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  carDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  detailBlock: {
    minWidth: 100,
    marginRight: 22,
  },
  detailLabel: {
    color: '#C4C9D4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
  },
  detailValue: {
    color: '#C4C9D4',
    fontSize: 13,
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
    fontSize: 16,
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
