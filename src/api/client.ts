
import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

// Crear un cliente de Axios configurado
// baseURL: URL de la API desde las variables de entorno de Expo
// headers: indica que el contenido es JSON

const config: CreateAxiosDefaults = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const client: AxiosInstance = axios.create(config);
