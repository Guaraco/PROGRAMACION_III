// Menú móvil y navegación
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Función para verificar si es móvil
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Función para cerrar el menú
    function closeMenu() {
        if (isMobile()) {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
            // Permitir el desplazamiento del body
            document.body.classList.remove('no-scroll');
            
            // Quitamos el display flex después de la animación
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 300);
        }
    }

    // Función para abrir el menú
    function openMenu() {
        if (isMobile()) {
            navLinks.style.display = 'flex';
            // Pequeño retraso para permitir que el CSS capture el cambio
            setTimeout(() => {
                navLinks.classList.add('active');
                menuBtn.classList.add('active');
                // Prevenir el desplazamiento del body cuando el menú está abierto
                document.body.classList.add('no-scroll');
            }, 10);
        }
    }

    // Toggle del menú móvil
    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Cerrar menú al hacer clic en un enlace
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Evitar que el clic dentro del menú lo cierre
    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Actualizar visualización del menú cuando cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            navLinks.style.display = 'flex';
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
        } else if (isMobile() && !menuBtn.classList.contains('active')) {
            navLinks.style.display = 'none';
            navLinks.classList.remove('active');
        }
    });

    // Inicializar estado del menú según el tamaño de pantalla
    if (!isMobile()) {
        navLinks.style.display = 'flex';
    } else {
        navLinks.style.display = 'none';
    }

    // Validación del formulario
    const contactoForm = document.getElementById('contacto-form');
    
    contactoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica
        if (nombre.length < 3) {
            alert('Por favor, ingrese un nombre válido (mínimo 3 caracteres)');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Por favor, ingrese un email válido');
            return;
        }
        
        if (mensaje.length < 10) {
            alert('Por favor, ingrese un mensaje (mínimo 10 caracteres)');
            return;
        }
        
        // Si pasa todas las validaciones, mostrar mensaje de éxito
        alert('¡Gracias por su mensaje! Nos pondremos en contacto pronto.');
        contactoForm.reset();
    });
});

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Animación suave al hacer scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80; // Ajusta este valor según la altura de tu header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animación de aparición al hacer scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a elementos
document.querySelectorAll('.producto-card, .contacto-form, .feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(el);
});

// Contador de estadísticas
function iniciarContadores() {
    const contadores = document.querySelectorAll('.contador');
    
    contadores.forEach(contador => {
        const target = parseFloat(contador.getAttribute('data-target'));
        const incremento = target / 100;
        let actual = 0;

        const actualizarContador = () => {
            if (actual < target) {
                actual += incremento;
                contador.textContent = actual.toFixed(1);
                setTimeout(actualizarContador, 10);
            } else {
                contador.textContent = target;
            }
        };

        actualizarContador();
    });
}

// Iniciar contadores cuando sean visibles
const contadoresObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            iniciarContadores();
            contadoresObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelector('.estadisticas').querySelectorAll('.estadistica-item').forEach(item => {
    contadoresObserver.observe(item);
}); 