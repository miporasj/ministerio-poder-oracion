// ========== IMPORTAR FIREBASE ==========
import { db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ========== NAVBAR ========== 
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========== VALIDACIÓN DE FORMULARIO ========== 
const form = document.getElementById('contactForm');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nombre = form.querySelector('[name="nombre"]');
        if (!nombre.value.trim()) {
            nombre.parentElement.classList.add('error');
            isValid = false;
        } else {
            nombre.parentElement.classList.remove('error');
            nombre.parentElement.classList.add('success');
        }

        const email = form.querySelector('[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.parentElement.classList.add('error');
            isValid = false;
        } else {
            email.parentElement.classList.remove('error');
            email.parentElement.classList.add('success');
        }

        const telefono = form.querySelector('[name="telefono"]');
        if (telefono.value && !/^\+?[\d\s\-()]{10,}$/.test(telefono.value)) {
            telefono.parentElement.classList.add('error');
            isValid = false;
        } else {
            telefono.parentElement.classList.remove('error');
            if (telefono.value) telefono.parentElement.classList.add('success');
        }

        const mensaje = form.querySelector('[name="mensaje"]');
        if (!mensaje.value.trim()) {
            mensaje.parentElement.classList.add('error');
            isValid = false;
        } else {
            mensaje.parentElement.classList.remove('error');
            mensaje.parentElement.classList.add('success');
        }

        if (isValid) {
            alert('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.');
            form.reset();
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('success'));
        }
    });

    form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                input.parentElement.classList.remove('error');
                if (input.name !== 'telefono' || input.value) {
                    input.parentElement.classList.add('success');
                }
            }
        });

        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.parentElement.classList.remove('error');
            }
        });
    });
}

// ========== ANIMACIÓN SCROLL EN TARJETAS ========== 
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
        }
    });
}, { threshold: 0.1 });

// ========== CARGAR NOTICIAS DESDE FIREBASE ========== 
async function cargarNoticias() {
    const grid = document.getElementById('noticiasGrid');
    
    try {
        const q = query(collection(db, 'noticias'), orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-light);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                    <p>No hay noticias disponibles en este momento.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const n = doc.data();
            grid.innerHTML += `
                <div class="noticia-card" style="position: relative; z-index: 2;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${n.icon}</div>
                    <p style="color: var(--color-primary); font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem;">${n.fecha}</p>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.75rem;">${n.titulo}</h3>
                    <p style="color: var(--color-text-light); line-height: 1.6;">${n.descripcion}</p>
                </div>
            `;
        });

        document.querySelectorAll('.noticia-card').forEach(card => observer.observe(card));
    } catch (error) {
        console.error('Error al cargar noticias:', error);
        grid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--color-danger);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <p>Error al cargar las noticias. Intenta recargar la página.</p>
            </div>
        `;
    }
}

// ========== CARGAR PRÉDICAS DESDE FIREBASE ========== 
async function cargarPredicas() {
    const grid = document.getElementById('predicasGrid');
    
    try {
        const q = query(collection(db, 'predicas'), orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-light);">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                    <p>No hay prédicas disponibles en este momento.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const p = doc.data();
            
            // Construir embed de YouTube si existe
            const videoHTML = p.videoId ? `
                <div style="margin-bottom: 1rem; border-radius: 12px; overflow: hidden;">
                    <iframe 
                        width="100%" 
                        height="250" 
                        src="https://www.youtube.com/embed/${p.videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="border-radius: 12px;">
                    </iframe>
                </div>
            ` : '';
            
            grid.innerHTML += `
                <div class="predica-card" style="position: relative; z-index: 2;">
                    ${videoHTML}
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.5rem;">${p.titulo}</h3>
                    <p style="color: var(--color-primary); font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">${p.predicador}</p>
                    <p style="color: var(--color-text-light); font-size: 0.85rem; margin-bottom: 0.75rem;">${p.fecha}</p>
                    <p style="color: var(--color-text-light); line-height: 1.6;">${p.descripcion}</p>
                </div>
            `;
        });

        document.querySelectorAll('.predica-card').forEach(card => observer.observe(card));
    } catch (error) {
        console.error('Error al cargar prédicas:', error);
        grid.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--color-danger);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <p>Error al cargar las prédicas. Intenta recargar la página.</p>
            </div>
        `;
    }
}

// ========== INICIALIZAR ========== 
document.addEventListener('DOMContentLoaded', () => {
    cargarNoticias();
    cargarPredicas();
    document.querySelectorAll('.horario-card').forEach(card => observer.observe(card));
});

// ========== RADIO FLOTANTE ========== 
const radioPlayer = document.getElementById('radioPlayer');
const radioToggle = document.getElementById('radioToggle');
const radioHeader = document.querySelector('.radio-header');

if (radioToggle && radioPlayer && radioHeader) {
    // Toggle al hacer click en el header
    radioHeader.addEventListener('click', () => {
        radioPlayer.classList.toggle('collapsed');
    });

    // Guardar estado en localStorage
    const savedState = localStorage.getItem('radioCollapsed');
    if (savedState === 'true') {
        radioPlayer.classList.add('collapsed');
    }

    // Guardar estado al cambiar
    radioHeader.addEventListener('click', () => {
        const isCollapsed = radioPlayer.classList.contains('collapsed');
        localStorage.setItem('radioCollapsed', isCollapsed);
    });
}

// ========== CARGAR DEVOCIONALES ========== 
async function loadDevocionales() {
    const container = document.getElementById('devocionalesContainer');
    if (!container) return;

    try {
        const q = query(collection(db, 'devocionales'), orderBy('fecha', 'desc'), limit(5));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">No hay devocionales disponibles</p>';
            return;
        }

        container.innerHTML = '';
        snapshot.forEach(doc => {
            const dev = doc.data();
            const card = document.createElement('div');
            card.className = 'devocional-card';
            card.innerHTML = `
                <div class="devocional-header">
                    <span class="devocional-fecha">📅 ${dev.fecha}</span>
                    <span class="devocional-autor">✍️ ${dev.autor}</span>
                </div>
                
                <div class="devocional-versiculo">
                    <div class="devocional-versiculo-ref">${dev.versiculo}</div>
                    <div class="devocional-versiculo-texto">"${dev.textoVersiculo}"</div>
                </div>

                <div class="devocional-section">
                    <div class="devocional-section-title">💭 Reflexión</div>
                    <div class="devocional-section-content">${dev.reflexion}</div>
                </div>

                <div class="devocional-section">
                    <div class="devocional-section-title">🙏 Oración</div>
                    <div class="devocional-oracion">${dev.oracion}</div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading devocionales:', error);
        container.innerHTML = '<p style="text-align: center; color: red;">Error al cargar devocionales</p>';
    }
}


