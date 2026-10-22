import {View, Text, FlatList} from 'react-native';
import { useCarros } from "@/hooks/useCarros";



export default function Explore(){
  const {data: carros = [], isLoading, error} = useCarros()

  if (isLoading) return <Text>Cargando carros...</Text>
  if (error) return <Text>Error al cargar carros: {error.message}</Text>

  return(
    <View style= {{flex:1,paddingTop:60,backgroundColor:'#fff'}}>
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
