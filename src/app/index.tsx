import {useState} from 'react';
import {View, Text, StyleSheet,Button,TextInput,FlatList} from 'react-native';
import {Carro} from '../types/carro';

import { carroService } from '@/api/carrito.service';
import { useCarros, useAgregarCarro } from '@/hooks/useCarros';

export default function App() {
  // Estado para manejar la lista de carros obtenida del backend mockeado
  // const [carros, setCarros] = useState<Carro[]>([]);
  // Estado para manejar el texto ingresado en el TextInput(marca del carro)
  const [marca, setMarca] = useState('');
  
  // Get de TanStack query para manejar la carga, cache y los estados
  const {data:carros = [], isLoading,error} = useCarros()

  // Post de TanStack : la mutacion invalida la query 'carros' y la lista se refresca
  const {mutate: agregarCarro} = useAgregarCarro()

  const agregar = async()=>{
    agregarCarro(marca,{onSuccess: () => setMarca('')})

  }

  // isLoading es true solo en la primera carga mientras no hay datos
  // Mientras mostramos un texto en lugar de la pantalla con la lista vacia
  if(isLoading) return <Text>Cargando...</Text>
  // Si el get fallo (sin red, servidor caido, etc) 'el metodo traer' trae la excepcion
  // mostramos un mensaje y no seguimos al return principal
  if(error) return <Text>Error: {error.message}</Text>


  return(
    <View style = {{flex:1, paddingTop:60,backgroundColor: '#fff'}}>
      <TextInput 
        value={marca}
        onChangeText={setMarca}
        style = {{borderWidth:3}}
      />
      <Button title="Agregar" onPress={agregar}/>
      <FlatList
        data = {carros}
      keyExtractor={(item) => item.id}
        renderItem= {({item}) =>
          <Text>{item.id} - {item.marca}</Text>
        }
          />


    </View>
  )

}
