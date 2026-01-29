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

// ========== ANIMACIÓN SCROLL EN TARJETAS ========== 
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
        }
    });
}, { threshold: 0.1 });

// ========== CARGAR NOTICIAS DESDE JSON ========== 
async function cargarNoticias() {
    try {
        const response = await fetch('data/noticias.json');
        const data = await response.json();
        const noticias = data.noticias;

        const grid = document.getElementById('noticiasGrid');
        grid.innerHTML = noticias.map(n => `
            <div class="noticia-card" style="position: relative; z-index: 2;">
                <img src="${n.imagen}" alt="${n.titulo}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;">
                <p style="color: var(--color-primary); font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem;">${n.fecha}</p>
                <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.75rem;">${n.titulo}</h3>
                <p style="color: var(--color-text-light); line-height: 1.6;">${n.descripcion}</p>
            </div>
        `).join('');

        document.querySelectorAll('.noticia-card').forEach(card => observer.observe(card));
    } catch (error) {
        console.error('Error al cargar noticias:', error);
    }
}


// ========== CARGAR PRÉDICAS DESDE JSON ========== 
async function cargarPredicas() {
    try {
        const response = await fetch('data/predicas.json');
        const data = await response.json();
        const predicas = data.predicas;

        const grid = document.getElementById('predicasGrid');
        grid.innerHTML = predicas.map(p => `
            <div class="predica-card" style="position: relative; z-index: 2;">
                <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; margin-bottom: 1rem; background: #000;">
                    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" src="https://www.youtube.com/embed/${p.videoId}?rel=0" title="${p.titulo}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.5rem;">${p.titulo}</h3>
                <p style="color: var(--color-primary); font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">${p.predicador}</p>
                <p style="color: var(--color-text-light); font-size: 0.85rem; margin-bottom: 0.75rem;">${p.fecha}</p>
                <p style="background-color: var(--color-bg-light); padding: 0.5rem; border-radius: 6px; color: var(--color-primary); font-size: 0.8rem; font-weight: 600; display: inline-block;">${p.categoria}</p>
            </div>
        `).join('');

        document.querySelectorAll('.predica-card').forEach(card => observer.observe(card));
    } catch (error) {
        console.error('Error al cargar prédicas:', error);
    }
}

// ========== INICIALIZAR ========== 
document.addEventListener('DOMContentLoaded', () => {
    cargarNoticias();
    cargarPredicas();
    document.querySelectorAll('.horario-card').forEach(card => observer.observe(card));
});
