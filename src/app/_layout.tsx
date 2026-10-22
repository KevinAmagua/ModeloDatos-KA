// Tab desde expo router define la navegacion tipo stack

import {Tabs} from 'expo-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';

// Creamos  una instanacia de QueryClient
// Este objeto administra la cache y el ciclo de vida de las querys/mutations
const qc = new QueryClient()

// Componente layout, para envolver la navegacion dentro del QueryClientProvider
// Con esto, todos los componentes hijos pueden usar useQuery y useMutation
// Este es el punto de integración entre TanStack y la navegación de Expo

export default function Layout(){

  return(
    <QueryClientProvider client = {qc}>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: {backgroundColor: '#0D0E12'},
          tabBarStyle: {
            backgroundColor: 'rgba(24, 26, 32, 0.97)',
            borderTopColor: 'rgba(227, 27, 35, 0.25)',
          },
          tabBarActiveTintColor: '#E31B23',
          tabBarInactiveTintColor: '#9E9EA7',
          tabBarLabelStyle: {fontWeight: '600'},
        }}
      >
        <Tabs.Screen name = "index" options = {{title:'Inicio'}}/>
        <Tabs.Screen name = "explore" options = {{title:'Explorar'}}/>
      </Tabs>
    </QueryClientProvider>
  )
}
