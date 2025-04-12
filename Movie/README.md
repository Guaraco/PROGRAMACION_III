# CineExplorer - Explorador de Películas Populares

Una aplicación web moderna que muestra películas populares utilizando la API gratuita de OMDb (Open Movie Database).

## Características

- Muestra películas populares con información completa
- Búsqueda aleatoria entre varias categorías populares
- Interfaz moderna con animaciones y transiciones fluidas
- Diseño responsive que se adapta a cualquier dispositivo
- Integración con la API de OMDb para datos reales de películas
- Pósters originales de las películas

## Tecnologías utilizadas

- HTML5 semántico y accesible
- CSS3 moderno (Variables CSS, Flexbox, Grid, Animaciones)
- JavaScript (async/await, Fetch API, Promise.all)
- API de OMDb para datos de películas
- Robohash como respaldo para películas sin póster

## Diseño Moderno

- Paleta de colores contemporánea usando variables CSS
- Animaciones y transiciones suaves
- Efectos de hover en las tarjetas
- Tipografía Inter de Google Fonts
- Indicador de carga SVG animado
- Diseño visual limpio y minimalista

## Configuración y uso

1. **API Key de OMDb**:
   - La aplicación usa la API Key '2ed8f7c2'
   - Para producciones extensas, obtén tu propia API Key en [OMDb API](https://www.omdbapi.com/apikey.aspx)
   - Reemplaza la API Key en el archivo app.js si es necesario

2. **Ejecuta la aplicación**:
   - Simplemente abre el archivo `index.html` en tu navegador
   - O utiliza un servidor local como Live Server en VSCode

## Vista previa

La aplicación muestra una cuadrícula de tarjetas de películas, cada una con:
- Póster original de la película
- Título de la película
- Año de lanzamiento y duración
- Género
- Descripción corta
- Nombre del director
- Calificación IMDb

## Personalización

Puedes personalizar fácilmente:
- Colores y estilos en `style.css` modificando las variables CSS
- Añadir más términos de búsqueda editando el array `SEARCH_TERMS` en app.js
- Ajustar las animaciones y transiciones

## Notas importantes

- La API de OMDb requiere una API Key, la aplicación usa la clave '2ed8f7c2'
- Las imágenes que no estén disponibles se generan mediante Robohash
- Datos proporcionados por [OMDb API](https://www.omdbapi.com/) 