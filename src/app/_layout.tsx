// Tab desde expo router define la navegacion tipo stack

import {Tabs} from 'expo-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// Creamos  una instanacia de QueryClient
// Este objeto administra la cache y el ciclo de vida de las querys/mutations
const qc = new QueryClient()

// Componente layout, para envolver la navegacion dentro del QueryClientProvider
// Con esto, todos los componentes hijos pueden usar useQuery y useMutation
// Este es el punto de integración entre TanStack y la navegacion de Expo

export default function Layout(){

  return(
    <QueryClientProvider client = {qc}>
      <Tabs>
        <Tabs.Screen name = "index" options = {{title:'Home'}}/>
        <Tabs.Screen name = "explore" options = {{title:'Explore'}}/>
      </Tabs>
      </QueryClientProvider>
  )

}