
        const navbar = document.getElementById('navbar');
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');


        if (!document.getElementById('navbar')) {
        console.warn('No se encontró el elemento navbar');
        }

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

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        function cargarNoticias() {
            const noticias = [
                {
                    titulo: 'Nuevo Grupo de Jóvenes',
                    descripcion: 'Hemos iniciado un grupo especial para jóvenes de 15-25 años con actividades dinámicas.',
                    fecha: '28 de Enero, 2026',
                    icon: '📢'
                },
                {
                    titulo: 'Retiro Espiritual',
                    descripcion: 'Te invitamos a nuestro retiro anual en la montaña del 15 al 17 de febrero.',
                    fecha: '25 de Enero, 2026',
                    icon: '⛰️'
                },
                {
                    titulo: 'Talleres de Capacitación',
                    descripcion: 'Aprende sobre liderazgo cristiano en nuestros talleres gratuitos cada sábado.',
                    fecha: '20 de Enero, 2026',
                    icon: '📚'
                }
            ];

            const grid = document.getElementById('noticiasGrid');
            grid.innerHTML = noticias.map(n => `
                <div class="noticia-card" style="position: relative; z-index: 2;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${n.icon}</div>
                    <p style="color: var(--color-primary); font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem;">${n.fecha}</p>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.75rem;">${n.titulo}</h3>
                    <p style="color: var(--color-text-light); line-height: 1.6;">${n.descripcion}</p>
                </div>
            `).join('');

            document.querySelectorAll('.noticia-card').forEach(card => observer.observe(card));
        }

        function cargarPredicas() {
            const predicas = [
                {
                    titulo: 'La Fe que Mueve Montañas',
                    predicador: 'Pastor Juan',
                    fecha: '2026-01-26',
                    descripcion: 'Una predicación profunda sobre cómo la fe genuina nos capacita para alcanzar lo imposible.'
                },
                {
                    titulo: 'Transformación del Corazón',
                    predicador: 'Pastor María',
                    fecha: '2026-01-19',
                    descripcion: 'Descubre cómo Dios transforma nuestro corazón y nos da una vida nueva en Cristo.'
                },
                {
                    titulo: 'El Poder de la Oración',
                    predicador: 'Pastor Carlos',
                    fecha: '2026-01-12',
                    descripcion: 'Aprende los secretos de una vida de oración efectiva y poderosa ante Dios.'
                }
            ];

            const grid = document.getElementById('predicasGrid');
            grid.innerHTML = predicas.map(p => `
                <div class="predica-card" style="position: relative; z-index: 2;">
                    <div style="font-size: 3rem; background: linear-gradient(135deg, var(--color-primary), var(--color-warning)); padding: 2rem; border-radius: 12px; text-align: center; color: white; margin-bottom: 1rem;">🎤</div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--color-text-dark); margin-bottom: 0.5rem;">${p.titulo}</h3>
                    <p style="color: var(--color-primary); font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">${p.predicador}</p>
                    <p style="color: var(--color-text-light); font-size: 0.85rem; margin-bottom: 0.75rem;">${p.fecha}</p>
                    <p style="color: var(--color-text-light); line-height: 1.6;">${p.descripcion}</p>
                </div>
            `).join('');

            document.querySelectorAll('.predica-card').forEach(card => observer.observe(card));
        }

        document.addEventListener('DOMContentLoaded', () => {
            cargarNoticias();
            cargarPredicas();
            document.querySelectorAll('.horario-card').forEach(card => observer.observe(card));
        });
