# Guía de Diseño Visual y Estilos (DESIGN.md) — Edición Patiotuerca

## 🎯 Objetivo

Rediseñar **únicamente la interfaz visual** de la aplicación existente (desarrollada con **React Native + TypeScript**), aplicando la identidad de marca de **Patiotuerca** en un estilo moderno, oscuro y minimalista enriquecido con efectos de **Glassmorphism** y **Blur**.

## 🎨 Estilo Visual (Branding Patiotuerca)

### Paleta de Colores

| Elemento | Código de Color / Valor | Descripción | 
| ----- | ----- | ----- | 
| **Tema Base** | `Dark Mode Automotive` | Estilo oscuro elegante del sector automotriz | 
| **Fondo Principal** | `#0D0E12` | Fondo general de la aplicación | 
| **Superficies** | `#181A20` | Paneles secundarios y elementos de fondo | 
| **Tarjetas Translúcidas** | `rgba(255, 255, 255, 0.05)` | Cristal esmerilado sobre superficie oscura | 
| **Bordes de Cristal** | `rgba(227, 27, 35, 0.25)` / `rgba(255,255,255,0.1)` | Delimitaciones con destellos de rojo corporativo | 
| **Color Principal (Patiotuerca Red)** | `#E31B23` | Rojo emblemático Patiotuerca (Acentos / Acciones) | 
| **Color Secundario / Highlight** | `#FF4D55` | Rojo brillante / Coral para estados `hover`, `active` o resaltados | 
| **Acento Neutro (Plata / Cromo)** | `#C4C9D4` | Detalles secundarios e iconos automotrices | 
| **Texto Principal** | `#FFFFFF` | Alta legibilidad sobre fondos oscuros | 
| **Texto Secundario** | `#9E9EA7` | Etiquetas, placeholders y detalles | 

## ✨ Glassmorphism y Efectos Blur

* **Efecto Blur:** Aplicar desenfoque moderado (`backdrop-filter` / `BlurView`) en tarjetas, paneles de vehículos, modales y navegación flotante.

* **Translucidez:** Utilizar fondos semitransparentes combinados con bordes finos que utilicen reflejos sutiles del rojo Patiotuerca (`rgba(227, 27, 35, 0.2)`).

* **Iluminación Ambiental:** Implementar gradientes oscuros con un ligero destello rojo/brasma de fondo y sombras suaves para dar volumen al catálogo de vehículos.

* **Legibilidad:** Priorizar el contraste en fichas de carros y precios en blanco (`#FFFFFF`) y rojo (`#E31B23`).

* **Fallback:** Garantizar una alternativa visual sólida (`#181A20` con borde rojo/gris sutil) si la plataforma o dispositivo no soporta blur en tiempo real.

## 🧩 Componentes

Aplicar un diseño consistente a lo largo de toda la interfaz:

* **Tarjetas de Vehículos / Carro:** Fondos translúcidos (`rgba(255,255,255,0.05)`), bordes sutiles en tono cristal/rojo (`rgba(227,27,35,0.2)`) y bordes redondeados entre `18px` y `24px`.

* **Botones Principales:** Fondo rojo Patiotuerca (`#E31B23`), esquinas redondeadas y retroalimentación visual al presionar (`#FF4D55`).

* **Inputs y Buscadores:** Fondos oscuros (`#181A20`), texto/placeholder en `#9E9EA7`, y resaltado de borde en rojo Patiotuerca (`#E31B23`) durante el foco.

* **Listas y Catálogo:** Distribución limpia, separación adecuada entre vehículos y jerarquía tipográfica visualmente clara para marcas, modelos y precios.

* **Tipografía:** Tipografía moderna y deportiva, con jerarquía mediante pesos de fuente y precios/títulos destacados.

* **Iconos:** Minimalistas, estilo automotriz y coherentes con la paleta de color.

* **Navegación:** Adaptar barras de navegación, pestañas y headers al tema oscuro translúcido con detalles en rojo.

* **Estados de UI:** Estilizar visualmente los estados de *loading*, *error*, *éxito* y *pantallas vacías (empty states)* usando gráficos o detalles en el color de la marca.

## 🛠️ Requisitos Técnicos

1. Mantener la pila tecnológica intacta: **React Native** + **TypeScript**.

2. Garantizar un diseño adaptable (*responsive*) perfecto tanto para **Android** como para **iOS**.

3. Reutilizar los componentes, estilos base y dependencias ya instaladas en el proyecto.

4. Respetar estrictamente las áreas seguras (`SafeAreaView`) y la compatibilidad con el teclado flotante (`KeyboardAvoidingView`).

5. **No añadir nuevas dependencias** salvo autorización explícita.

6. Mantener una interfaz accesible, fluida, ágil y de fácil lectura.

## ⚠️ Restricción Principal: NO Modificar la Lógica

Este encargo es **exclusivamente visual**. Queda strictly prohibido refactorizar o modificar:

* 🚫 Lógica de negocio.

* 🚫 Peticiones HTTP de Axios.

* 🚫 Custom Hooks, consultas (`queries`), mutaciones (`mutations`) o caché de **TanStack Query**.

* 🚫 Operaciones CRUD (incluyendo eliminación de carros u operaciones optimistas).

* 🚫 Endpoints de MockAPI, APIs externas o backend.

* 🚫 Modelos, interfaces y tipos de TypeScript (`.types.ts`, `interface`, etc.).

* 🚫 Estados (`useState`, `useReducer`), efectos (`useEffect`), validaciones o callbacks funcionales.

* 🚫 Configuración de rutas, navegación y contratos entre componentes.

* 🚫 Estructura general de datos o dependencias del proyecto (`package.json`).

> **Permitido:** Modificar exclusivamente estilos (`StyleSheet`), colores, espaciados, tipografías, bordes, sombras y distribución visual, manteniendo intactos los comportamientos existentes.

## 📋 Pasos de Implementación

1. **Inspección:** Analizar la estructura general del proyecto antes de realizar modificaciones.

2. **Identificación:** Ubicar los componentes, pantallas y hojas de estilo existentes.

3. **Aplicación de Marca:** Integrar la paleta de color de Patiotuerca (`#E31B23`) y los estilos de Glassmorphism.

4. **Rediseño:** Mejorar la presentación visual de todas las pantallas existentes.

5. **Preservación:** Validar que las funcionalidades, datos dinámicos e interacciones se mantengan operativas.

6. **Verificación:** Comprobar que no existan errores de compilación de TypeScript ni afectaciones al comportamiento original.

> 📌 **Regla Final:** Modificar **únicamente** el diseño visual. Si un cambio estético requiere alterar la lógica interna o los contratos de datos del componente, **no debe realizarse**.