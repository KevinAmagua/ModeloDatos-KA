// Importar el cliente en axios y el tipo carro

import {client} from './client'
import {Carro} from '../types/carro'

// Definir un sericio llamado carrosService
// El servicio centraliza las operaciones de la entidad Carro
// Retorna una promesa con un arreglo de objetos
// Poner metodos asincronicos para interactuar con la API

export const carroService = {
    // Metodo Get
    getAll: async (): Promise<Carro[]> =>{
        const {data} = await client.get<Carro[]>('patio')
        return data
    },

    // Metodo POST: agregar un nuevo carro, retornar la promsesa del objeto creado
    add: async(marca:string): Promise<Carro> =>{
        const {data} = await client.post<Carro>('patio',{marca})
        return data
    }


}
