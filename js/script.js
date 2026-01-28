// ========================================
// VERSÍCULOS DEL DÍA - BASE DE DATOS
// ========================================
const versiculos = [
    { texto: "Porque Dios ha dicho: Nunca te dejaré, ni te desampararé.", referencia: "Hebreos 13:5" },
    { texto: "Todo lo puedo en Cristo que me fortalece.", referencia: "Filipenses 4:13" },
    { texto: "Porque por gracia sois salvos por la fe; y esto no de vosotros, pues es don de Dios.", referencia: "Efesios 2:8" },
    { texto: "El Señor es mi luz y mi salvación; ¿de quién temeré?", referencia: "Salmos 27:1" },
    { texto: "Encomienda al Señor tu camino, y confía en él; y él hará.", referencia: "Salmos 37:5" },
    { texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.", referencia: "Isaías 41:10" },
    { texto: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.", referencia: "Josué 1:9" },
    { texto: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.", referencia: "Romanos 8:28" },
    { texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", referencia: "Mateo 11:28" },
    { texto: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.", referencia: "2 Timoteo 1:7" },
    { texto: "Y él dijo: Mi gracia te es suficiente, porque mi poder se perfecciona en la debilidad.", referencia: "2 Corintios 12:9" },
    { texto: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", referencia: "Mateo 6:33" },
    { texto: "Porque Dios no es Dios de confusión, sino de paz.", referencia: "1 Corintios 14:33" },
    { texto: "Abro mis manos y me colmo de amor por todo lo que existe.", referencia: "Salmos 119:131" },
    { texto: "Jehová bendiga al pueblo con paz.", referencia: "Salmos 29:11" },
    { texto: "Que la paz de Cristo reine en vuestros corazones.", referencia: "Colosenses 3:15" },
    { texto: "Porque ahora vemos por espejo, oscuramente; mas entonces veremos cara a cara.", referencia: "1 Corintios 13:12" },
    { texto: "Y esta es la confianza que tenemos en él, que si pedimos alguna cosa conforme a su voluntad, él nos oye.", referencia: "1 Juan 5:14" },
    { texto: "La oración de fe salvará al enfermo, y el Señor lo levantará.", referencia: "Santiago 5:15" },
    { texto: "Y el que creyere en mí, aunque esté muerto, vivirá. Y todo aquel que vive y cree en mí, no morirá eternamente.", referencia: "Juan 11:25-26" }
];

// ========================================
// FUNCIONES VERSÍCULOS
// ========================================
function obtenerVersiculo() {
    const hoy = new Date();
    const semilla = hoy.getFullYear() * 10000 + hoy.getMonth() * 100 + hoy.getDate();
    return versiculos[semilla % versiculos.length];
}

function obtenerVersiuloAleatorio() {
    return versiculos[Math.floor(Math.random() * versiculos.length)];
}

function actualizarVersiculo() {
    const versiculo = obtenerVersiuloAleatorio();
    const elementoTexto = document.getElementById('versiculo-texto');
    const elementoReferencia = document.getElementById('versiculo-referencia');
    
    if (elementoTexto && elementoReferencia) {
        elementoTexto.style.opacity = '0';
        elementoReferencia.style.opacity = '0';
        
        setTimeout(() => {
            elementoTexto.textContent = `"${versiculo.texto}"`;
            elementoReferencia.textContent = versiculo.referencia;
            elementoTexto.style.opacity = '1';
            elementoReferencia.style.opacity = '1';
        }, 300);
    }
}

// ========================================
// FUNCIONES NOTICIAS (desde JSON con imágenes)
// ========================================
async function cargarNoticias() {
    const container = document.getElementById('noticias-container');
    
    if (!container) return;
    
    try {
        // Cargar noticias desde data/noticias.json
        const response = await fetch('data/noticias.json');
        const data = await response.json();
        const noticias = data.noticias;
        
        if (!noticias || noticias.length === 0) {
            container.innerHTML = '<p>No hay noticias en este momento.</p>';
            return;
        }
        
        // Ordenar por más recientes primero
        const noticiasOrdenadas = [...noticias].sort((a, b) => {
            return new Date(b.fecha) - new Date(a.fecha);
        });
        
        // Renderizar noticias CON IMÁGENES
        container.innerHTML = noticiasOrdenadas.map(noticia => `
            <div class="noticia-card">
                <div class="noticia-imagen" style="background-image: url('${noticia.imagen}'); background-size: cover; background-position: center;">
                </div>
                <div class="noticia-content">
                    <p class="noticia-fecha">${noticia.fecha}</p>
                    <h3 class="noticia-titulo">${noticia.titulo}</h3>
                    <p class="noticia-descripcion">${noticia.descripcion}</p>
                    <a href="${noticia.enlace}" class="noticia-link">Leer más</a>
                </div>
            </div>
        `).join('');
        
        console.log('✅ Noticias cargadas:', noticiasOrdenadas.length);
        
    } catch (error) {
        console.error('❌ Error al cargar noticias:', error);
        container.innerHTML = '<p>Error al cargar las noticias.</p>';
    }
}

// ========================================
// FUNCIONES PRÉDICAS (desde JSON)
// ========================================
async function cargarPredicas() {
    const container = document.getElementById('predicas-container');
    
    if (!container) return;
    
    try {
        // Cargar prédicas desde data/predicas.json
        const response = await fetch('data/predicas.json');
        const data = await response.json();
        const predicas = data.predicas;
        
        if (!predicas || predicas.length === 0) {
            container.innerHTML = '<p>No hay prédicas disponibles en este momento.</p>';
            return;
        }
        
        // Ordenar por más recientes primero
        const predicasOrdenadas = [...predicas].sort((a, b) => {
            return new Date(b.fecha) - new Date(a.fecha);
        });
        
        // Renderizar prédicas
        container.innerHTML = predicasOrdenadas.map(predica => `
            <div class="predica-card">
                <div class="predica-video">
                    <iframe
                        src="https://www.youtube.com/embed/${predica.videoId}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="predica-content">
                    <span class="predica-categoria">${predica.categoria}</span>
                    <h3 class="predica-titulo">${predica.titulo}</h3>
                    <p class="predica-predicador">👤 ${predica.predicador}</p>
                    <p class="predica-fecha">📅 ${predica.fecha}</p>
                    <a href="https://www.youtube.com/watch?v=${predica.videoId}" target="_blank" rel="noopener noreferrer" class="predica-ver">
                        Ver en YouTube
                    </a>
                </div>
            </div>
        `).join('');
        
        console.log('✅ Prédicas cargadas:', predicasOrdenadas.length);
        
    } catch (error) {
        console.error('❌ Error al cargar prédicas:', error);
        container.innerHTML = '<p>Error al cargar las prédicas.</p>';
    }
}


// ========================================
// EFECTOS VISUALES
// ========================================
function agregarTransiciones() {
    document.querySelectorAll('.horario-card, .red-card, .contacto-card, .noticia-card, .predica-card').forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
}

function agregarEfectosScroll() {
    const elementos = document.querySelectorAll('.horario-card, .red-card, .contacto-card, .versiculo-card, .noticia-card, .predica-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elementos.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'all 0.6s ease';
        observer.observe(elemento);
    });
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Página cargada correctamente');
    console.log('🙏 Ministerio Poder de la Oración - San Juan');
    
    // Versículos
    const versiculo = obtenerVersiculo();
    const elementoTexto = document.getElementById('versiculo-texto');
    const elementoReferencia = document.getElementById('versiculo-referencia');
    
    if (elementoTexto && elementoReferencia) {
        elementoTexto.textContent = `"${versiculo.texto}"`;
        elementoReferencia.textContent = versiculo.referencia;
    }
    
    const btnNuevoVersiculo = document.getElementById('btn-nuevo-versiculo');
    if (btnNuevoVersiculo) {
        btnNuevoVersiculo.addEventListener('click', actualizarVersiculo);
    }
    
    // Noticias desde JSON
    cargarNoticias();
    cargarPredicas();
    
    // Efectos
    agregarTransiciones();
    agregarEfectosScroll();
});

// ========================================
// SCROLL EFFECTS
// ========================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.boxShadow = window.scrollY > 50 
            ? '0 4px 16px rgba(0, 0, 0, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
