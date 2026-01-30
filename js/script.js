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
            
            // Si tiene video, mostrar thumbnail clickeable
            const headerHTML = p.videoId ? `
                <a href="https://www.youtube.com/watch?v=${p.videoId}" target="_blank" style="display: block; position: relative; cursor: pointer; border-radius: 12px; overflow: hidden; margin-bottom: 1rem;">
                    <img 
                        src="https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg" 
                        alt="Video de la prédica"
                        style="width: 100%; height: auto; display: block; transition: transform 0.3s ease;"
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'"
                    >
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </a>
            ` : `
                <div style="font-size: 3rem; background: linear-gradient(135deg, var(--color-primary), var(--color-warning)); padding: 2rem; border-radius: 12px; text-align: center; color: white; margin-bottom: 1rem;">🎤</div>
            `;
            
            grid.innerHTML += `
                <div class="predica-card" style="position: relative; z-index: 2;">
                    ${headerHTML}
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
