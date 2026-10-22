// Importamos los hooks de tanstack query:
// useQuery: para consultas get  
// useQueryClient: para interactuar con la cache (invalida,refrescar)
// useMutation : para operaciones CRUD 

import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import { carroService } from '@/api/carrito.service'

const KEY = ['carros']

export function useCarros (){
    return useQuery({
        queryKey: ['carros'],
        queryFn: ()=>{
            console.log("Get ejecutado con TanStack")
        },
        // StaleTime = no quiere decir cuanto tiempo se guardan datos en cache 
        // cuanto tiempo los datos se consideran frescos
        staleTime: 1000*60*5 // Cache valido por 5 min

    })
}

// Hook personalizado useAgregar carro que encapsula la logica para agregar un carro nuevo
// UseMutation con mutationFn que llama a carroService.add()

export function useAgregarCarro(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (marca:string) => carroService.add(marca),
        onSuccess: ()=> qc.invalidateQueries({queryKey:KEY})
    })
}