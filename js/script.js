// ========================================
// VERSÍCULOS DEL DÍA - BASE DE DATOS
// ========================================
const versiculos = [
    {
        texto: "Porque Dios ha dicho: Nunca te dejaré, ni te desampararé.",
        referencia: "Hebreos 13:5"
    },
    {
        texto: "Todo lo puedo en Cristo que me fortalece.",
        referencia: "Filipenses 4:13"
    },
    {
        texto: "Porque por gracia sois salvos por la fe; y esto no de vosotros, pues es don de Dios.",
        referencia: "Efesios 2:8"
    },
    {
        texto: "El Señor es mi luz y mi salvación; ¿de quién temeré?",
        referencia: "Salmos 27:1"
    },
    {
        texto: "Encomienda al Señor tu camino, y confía en él; y él hará.",
        referencia: "Salmos 37:5"
    },
    {
        texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.",
        referencia: "Isaías 41:10"
    },
    {
        texto: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.",
        referencia: "Josué 1:9"
    },
    {
        texto: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.",
        referencia: "Romanos 8:28"
    },
    {
        texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
        referencia: "Mateo 11:28"
    },
    {
        texto: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.",
        referencia: "2 Timoteo 1:7"
    },
    {
        texto: "Y él dijo: Mi gracia te es suficiente, porque mi poder se perfecciona en la debilidad.",
        referencia: "2 Corintios 12:9"
    },
    {
        texto: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.",
        referencia: "Mateo 6:33"
    },
    {
        texto: "Porque Dios no es Dios de confusión, sino de paz.",
        referencia: "1 Corintios 14:33"
    },
    {
        texto: "Abro mis manos y me colmo de amor por todo lo que existe.",
        referencia: "Salmos 119:131"
    },
    {
        texto: "Jehová bendiga al pueblo con paz.",
        referencia: "Salmos 29:11"
    },
    {
        texto: "Que la paz de Cristo reine en vuestros corazones.",
        referencia: "Colosenses 3:15"
    },
    {
        texto: "Porque ahora vemos por espejo, oscuramente; mas entonces veremos cara a cara.",
        referencia: "1 Corintios 13:12"
    },
    {
        texto: "Y esta es la confianza que tenemos en él, que si pedimos alguna cosa conforme a su voluntad, él nos oye.",
        referencia: "1 Juan 5:14"
    },
    {
        texto: "La oración de fe salvará al enfermo, y el Señor lo levantará.",
        referencia: "Santiago 5:15"
    },
    {
        texto: "Y el que creyere en mí, aunque esté muerto, vivirá. Y todo aquel que vive y cree en mí, no morirá eternamente.",
        referencia: "Juan 11:25-26"
    }
];

// ========================================
// FUNCIONES PARA VERSÍCULOS
// ========================================

/**
 * Obtiene el versículo del día basado en la fecha
 */
function obtenerVersiculo() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = hoy.getMonth();
    const dia = hoy.getDate();
    
    // Crear una semilla basada en la fecha
    const semilla = año * 10000 + mes * 100 + dia;
    
    // Usar la semilla para obtener un índice consistente
    const indice = semilla % versiculos.length;
    
    return versiculos[indice];
}

/**
 * Obtiene un versículo aleatorio
 */
function obtenerVersiuloAleatorio() {
    const indice = Math.floor(Math.random() * versiculos.length);
    return versiculos[indice];
}

/**
 * Actualiza el versículo en la página
 */
function actualizarVersiculo() {
    const versiculo = obtenerVersiuloAleatorio();
    const elementoTexto = document.getElementById('versiculo-texto');
    const elementoReferencia = document.getElementById('versiculo-referencia');
    
    if (elementoTexto && elementoReferencia) {
        // Agregar animación de fade out
        elementoTexto.style.opacity = '0';
        elementoReferencia.style.opacity = '0';
        
        setTimeout(() => {
            elementoTexto.textContent = `"${versiculo.texto}"`;
            elementoReferencia.textContent = versiculo.referencia;
            
            // Fade in
            elementoTexto.style.opacity = '1';
            elementoReferencia.style.opacity = '1';
        }, 300);
    }
}

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el versículo del día al cargar la página
    const versiculo = obtenerVersiculo();
    const elementoTexto = document.getElementById('versiculo-texto');
    const elementoReferencia = document.getElementById('versiculo-referencia');
    
    if (elementoTexto && elementoReferencia) {
        elementoTexto.textContent = `"${versiculo.texto}"`;
        elementoReferencia.textContent = versiculo.referencia;
    }
    
    // Agregar evento al botón de nuevo versículo
    const btnNuevoVersiculo = document.getElementById('btn-nuevo-versiculo');
    if (btnNuevoVersiculo) {
        btnNuevoVersiculo.addEventListener('click', actualizarVersiculo);
    }
    
    // Agregar suavidad en transiciones
    agregarTransiciones();
    
    // Detectar scroll para efectos visuales
    agregarEfectosScroll();
});

// ========================================
// EFECTOS VISUALES
// ========================================

/**
 * Agrega transiciones suaves a elementos
 */
function agregarTransiciones() {
    const elementos = document.querySelectorAll('.horario-card, .red-card, .contacto-card');
    
    elementos.forEach(elemento => {
        elemento.style.transition = 'all 0.3s ease';
    });
}

/**
 * Agrega efectos al hacer scroll
 */
function agregarEfectosScroll() {
    const elementosAnimados = document.querySelectorAll(
        '.horario-card, .red-card, .contacto-card, .versiculo-card'
    );
    
    // Observer para animaciones al entrar en viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elementosAnimados.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'all 0.6s ease';
        observer.observe(elemento);
    });
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Suaviza el scroll a elementos con anclas
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Permitir comportamiento normal si es el header
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const elemento = document.querySelector(href);
            elemento.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// EFECTO NAVBAR AL SCROLL
// ========================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

console.log('✨ Página cargada correctamente');
console.log('🙏 Ministerio Poder de la Oración - San Juan');