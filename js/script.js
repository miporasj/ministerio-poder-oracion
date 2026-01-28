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
// YOUTUBE LIVE - FUNCIÓN PRINCIPAL
// ========================================
const YOUTUBE_CHANNEL_ID = "UC77XbHPEr4zjorRUvh0LF_w";

async function checkYouTubeLive() {
    const statusContainer = document.getElementById('youtube-status');
    
    if (!statusContainer) return;
    
    try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
        const response = await fetch(rssUrl);
        const xmlText = await response.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const entries = xmlDoc.getElementsByTagName('entry');
        
        if (entries.length > 0) {
            const latestVideo = entries[0];
            const videoIdElement = latestVideo.getElementsByTagName('yt:videoId')[0];
            
            if (videoIdElement) {
                const videoId = videoIdElement.textContent;
                statusContainer.innerHTML = `
                    <div style="width: 100%; padding-top: 56.25%; position: relative; background: #000; margin: 20px 0;">
                        <iframe
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                            src="https://www.youtube.com/embed/${videoId}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                    <p style="text-align: center; font-size: 12px; color: var(--color-verde); margin-top: 10px;">
                        <i class="fas fa-circle" style="animation: pulse-red 1s infinite;"></i> ÚLTIMO VIDEO
                    </p>
                `;
                console.log('✅ Video cargado:', videoId);
            }
        }
    } catch (error) {
        console.log('⚠️ Error al cargar YouTube:', error);
    }
}

// ========================================
// EFECTOS VISUALES
// ========================================
function agregarTransiciones() {
    document.querySelectorAll('.horario-card, .red-card, .contacto-card').forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
}

function agregarEfectosScroll() {
    const elementos = document.querySelectorAll('.horario-card, .red-card, .contacto-card, .versiculo-card');
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
// INICIALIZACIÓN - UNA SOLA VEZ
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Página cargada correctamente');
    
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
    
    // Efectos
    agregarTransiciones();
    agregarEfectosScroll();
    
    // YouTube Live
    checkYouTubeLive();
    setInterval(checkYouTubeLive, 60000);
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
