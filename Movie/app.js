// Elementos del DOM
const moviesContainer = document.getElementById('movies-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');
const ratingFilter = document.getElementById('rating-filter');
const resetFiltersButton = document.getElementById('reset-filters');
const categoryTags = document.querySelectorAll('.category-tag');
const resultsCount = document.getElementById('results-count').querySelector('span');
const gridViewButton = document.getElementById('grid-view');
const listViewButton = document.getElementById('list-view');
const loadMoreButton = document.getElementById('load-more');

// Configuración de la API - OMDb API
const API_KEY = '2ed8f7c2'; // Nueva API Key proporcionada por el usuario
const SEARCH_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;
const DETAIL_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&i=`;

// Lista de términos de búsqueda populares para obtener películas variadas
const SEARCH_TERMS = [
    'star wars',
    'godfather',
    'avengers',
    'harry potter',
    'matrix',
    'jurassic',
    'batman',
    'terminator'
];

// Estado de la aplicación
let allMovies = [];         // Todas las películas cargadas
let filteredMovies = [];    // Películas después de aplicar filtros
let currentPage = 1;        // Página actual para cargar más
let currentSearch = '';     // Término de búsqueda actual
let isLoading = false;      // Estado de carga
let viewMode = 'grid';      // Modo de vista (grid o list)

// Inicialización de la aplicación
async function initApp() {
    try {
        // Elegir un término de búsqueda aleatorio para cargar inicialmente
        const randomTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
        await searchMovies(randomTerm);
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showError(error.message);
    }
}

// Función para realizar búsqueda de películas
async function searchMovies(searchTerm, page = 1) {
    if (isLoading) return;
    
    // Actualizar estado
    isLoading = true;
    currentSearch = searchTerm;
    currentPage = page;
    
    // Mostrar la UI de carga solo si es la primera página
    if (page === 1) {
        loadingElement.style.display = 'flex';
        moviesContainer.innerHTML = '';
        allMovies = [];
        filteredMovies = [];
    }
    
    try {
        console.log(`Buscando: "${searchTerm}", página ${page}`);
        const response = await fetch(`${SEARCH_URL}${encodeURIComponent(searchTerm)}&type=movie&page=${page}`);
        
        if (!response.ok) {
            throw new Error('No se pudieron cargar las películas');
        }
        
        const data = await response.json();
        console.log('Respuesta de búsqueda:', data);
        
        if (data.Response === 'False') {
            // Si es la primera página y no hay resultados, mostrar error
            if (page === 1) {
                throw new Error(data.Error || 'No se encontraron películas');
            } else {
                // Si es una página posterior, simplemente no hay más resultados
                loadMoreButton.style.display = 'none';
                return;
            }
        }
        
        // Obtener detalles completos de las películas
        const newMovies = await getMovieDetails(data.Search);
        
        // Agregar las nuevas películas al array completo
        if (page === 1) {
            allMovies = newMovies;
        } else {
            allMovies = [...allMovies, ...newMovies];
        }
        
        // Aplicar filtros actuales a las películas cargadas
        applyFilters();
        
        // Mostrar botón de cargar más si hay más páginas
        const totalResults = parseInt(data.totalResults);
        const hasMorePages = page * 10 < totalResults;
        loadMoreButton.style.display = hasMorePages ? 'flex' : 'none';
        
    } catch (error) {
        console.error('Error al buscar películas:', error);
        showError(error.message);
        loadMoreButton.style.display = 'none';
    } finally {
        loadingElement.style.display = 'none';
        isLoading = false;
    }
}

// Función para obtener detalles de cada película
async function getMovieDetails(movies) {
    try {
        const detailedMovies = await Promise.all(
            movies.map(async (movie) => {
                try {
                    const response = await fetch(`${DETAIL_URL}${movie.imdbID}`);
                    if (!response.ok) {
                        throw new Error(`Error al obtener detalles de ${movie.Title}`);
                    }
                    const data = await response.json();
                    console.log(`Detalles para ${movie.Title}:`, data);
                    return data;
                } catch (error) {
                    console.error(`Error al obtener detalles de ${movie.Title}:`, error);
                    return null;
                }
            })
        );
        
        // Filtrar películas nulas (error al obtener detalles)
        return detailedMovies.filter(movie => movie !== null);
    } catch (error) {
        console.error('Error al obtener detalles de películas:', error);
        return [];
    }
}

// Función para aplicar todos los filtros a las películas
function applyFilters() {
    const genreValue = genreFilter.value;
    const yearValue = yearFilter.value;
    const ratingValue = parseFloat(ratingFilter.value);
    
    // Filtrar películas según los criterios seleccionados
    filteredMovies = allMovies.filter(movie => {
        // Filtro de género
        if (genreValue && !movie.Genre.includes(genreValue)) {
            return false;
        }
        
        // Filtro de año
        if (yearValue) {
            const movieYear = parseInt(movie.Year);
            const [startYear, endYear] = yearValue.split('-').map(Number);
            
            if (movieYear < startYear || movieYear > endYear) {
                return false;
            }
        }
        
        // Filtro de calificación
        if (ratingValue) {
            const movieRating = parseFloat(movie.imdbRating);
            if (isNaN(movieRating) || movieRating < ratingValue) {
                return false;
            }
        }
        
        return true;
    });
    
    // Actualizar la UI con las películas filtradas
    displayMovies(filteredMovies);
}

// Función para crear tarjeta de película
function createMovieCard(movie, index) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.style.setProperty('--animation-order', index);
    
    // Obtener la imagen del póster o generar una imagen con Robohash
    const posterPath = movie.Poster && movie.Poster !== 'N/A' 
        ? movie.Poster 
        : `https://robohash.org/${movie.Title}?set=set4&size=500x500`;
    
    // Limitar la descripción a un número máximo de caracteres
    const overview = movie.Plot && movie.Plot !== 'N/A' 
        ? movie.Plot 
        : 'No hay descripción disponible para esta película.';
    
    // Construir el HTML para la tarjeta de película
    movieCard.innerHTML = `
        <div class="movie-poster-container">
            <img src="${posterPath}" alt="${movie.Title}" class="movie-poster">
            <div class="movie-rating">${movie.imdbRating !== 'N/A' ? movie.imdbRating : '?'}</div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.Title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${movie.Year !== 'N/A' ? movie.Year : 'Desconocido'}</span>
                <span class="movie-runtime">${movie.Runtime !== 'N/A' ? movie.Runtime : 'Desconocido'}</span>
            </div>
            <p class="movie-genre">${movie.Genre !== 'N/A' ? movie.Genre : 'Género desconocido'}</p>
            <p class="movie-overview">${overview}</p>
            <div class="movie-director">
                <span>Director:</span> ${movie.Director !== 'N/A' ? movie.Director : 'Desconocido'}
            </div>
        </div>
    `;
    
    return movieCard;
}

// Función para mostrar las películas en la página
function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    
    // Si no hay películas, mostrar mensaje
    if (movies.length === 0) {
        errorElement.textContent = 'No se encontraron películas que coincidan con los filtros.';
        errorElement.style.display = 'block';
        resultsCount.textContent = '0';
        return;
    }
    
    // Ocultar mensaje de error si hay películas
    errorElement.style.display = 'none';
    
    // Actualizar clase de contenedor según el modo de vista
    moviesContainer.className = viewMode === 'grid' ? 'movies-grid' : 'movies-list';
    
    // Actualizar contador de resultados
    resultsCount.textContent = movies.length;
    
    // Crear y agregar tarjetas de películas al contenedor
    movies.forEach((movie, index) => {
        const movieCard = createMovieCard(movie, index);
        moviesContainer.appendChild(movieCard);
    });
}

// Función para mostrar mensaje de error
function showError(message = 'Ocurrió un error al cargar las películas. Por favor, intenta de nuevo más tarde.') {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    loadingElement.style.display = 'none';
    resultsCount.textContent = '0';
}

// Función para cargar más películas
function loadMoreMovies() {
    if (isLoading) return;
    searchMovies(currentSearch, currentPage + 1);
}

// Función para restablecer todos los filtros
function resetFilters() {
    searchInput.value = '';
    genreFilter.value = '';
    yearFilter.value = '';
    ratingFilter.value = '';
    
    // Quitar clases activas de las categorías
    categoryTags.forEach(tag => tag.classList.remove('active'));
    
    // Aplicar filtros (sin filtros activos, mostrará todas las películas)
    applyFilters();
}

// Función para cambiar el modo de vista
function changeViewMode(mode) {
    viewMode = mode;
    
    // Actualizar botones
    if (mode === 'grid') {
        gridViewButton.classList.add('active');
        listViewButton.classList.remove('active');
    } else {
        gridViewButton.classList.remove('active');
        listViewButton.classList.add('active');
    }
    
    // Actualizar vista
    displayMovies(filteredMovies);
}

// Event Listeners

// Búsqueda
searchButton.addEventListener('click', () => {
    const term = searchInput.value.trim();
    if (term) {
        searchMovies(term);
        
        // Desactivar categorías al hacer búsqueda manual
        categoryTags.forEach(tag => tag.classList.remove('active'));
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Filtros
genreFilter.addEventListener('change', applyFilters);
yearFilter.addEventListener('change', applyFilters);
ratingFilter.addEventListener('change', applyFilters);
resetFiltersButton.addEventListener('click', resetFilters);

// Categorías de búsqueda
categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // Si ya está activa, desactivarla
        if (tag.classList.contains('active')) {
            tag.classList.remove('active');
            resetFilters();
            return;
        }
        
        // Desactivar todas las etiquetas
        categoryTags.forEach(t => t.classList.remove('active'));
        
        // Activar la etiqueta seleccionada
        tag.classList.add('active');
        
        // Obtener el término de búsqueda y realizar la búsqueda
        const term = tag.dataset.term;
        searchInput.value = '';  // Limpiar input de búsqueda
        searchMovies(term);
    });
});

// Cambio de vista
gridViewButton.addEventListener('click', () => changeViewMode('grid'));
listViewButton.addEventListener('click', () => changeViewMode('list'));

// Cargar más películas
loadMoreButton.addEventListener('click', loadMoreMovies);

// Cargar películas cuando se carga la página
document.addEventListener('DOMContentLoaded', initApp); 