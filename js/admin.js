// Extraer ID de video de YouTube
function extractYouTubeID(url) {
    if (!url) return '';
    
    // Si ya es solo el ID (11 caracteres alfanuméricos)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
        return url.trim();
    }
    
    // Extraer de URL completa
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}


// ========== IMPORTAR FIREBASE ==========
import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ========== ELEMENTOS DEL DOM ==========
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');

// Tabs
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Modales
const noticiaModal = document.getElementById('noticiaModal');
const predicaModal = document.getElementById('predicaModal');

// Botones
const addNoticiaBtn = document.getElementById('addNoticiaBtn');
const addPredicaBtn = document.getElementById('addPredicaBtn');
const closeNoticiaModal = document.getElementById('closeNoticiaModal');
const closePredicaModal = document.getElementById('closePredicaModal');

// Formularios
const noticiaForm = document.getElementById('noticiaForm');
const predicaForm = document.getElementById('predicaForm');

// Listas
const noticiasList = document.getElementById('noticiasList');
const predicasList = document.getElementById('predicasList');

// ========== AUTENTICACIÓN ==========
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        dashboard.classList.add('active');
        userEmail.textContent = user.email;
        cargarNoticias();
        cargarPredicas();
    } else {
        loginScreen.style.display = 'block';
        dashboard.classList.remove('active');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.classList.remove('show');
    } catch (error) {
        loginError.textContent = 'Email o contraseña incorrectos';
        loginError.classList.add('show');
    }
});

logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
});

// ========== TABS ==========
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTab) {
                content.classList.add('active');
            }
        });
    });
});

// ========== MODALES ==========
addNoticiaBtn.addEventListener('click', () => {
    document.getElementById('noticiaModalTitle').textContent = 'Nueva Noticia';
    noticiaForm.reset();
    document.getElementById('noticiaId').value = '';
    noticiaModal.classList.add('active');
});

addPredicaBtn.addEventListener('click', () => {
    document.getElementById('predicaModalTitle').textContent = 'Nueva Prédica';
    predicaForm.reset();
    document.getElementById('predicaId').value = '';
    predicaModal.classList.add('active');
});

closeNoticiaModal.addEventListener('click', () => {
    noticiaModal.classList.remove('active');
});

closePredicaModal.addEventListener('click', () => {
    predicaModal.classList.remove('active');
});

// Cerrar modal al hacer click fuera
noticiaModal.addEventListener('click', (e) => {
    if (e.target === noticiaModal) {
        noticiaModal.classList.remove('active');
    }
});

predicaModal.addEventListener('click', (e) => {
    if (e.target === predicaModal) {
        predicaModal.classList.remove('active');
    }
});

// ========== NOTICIAS CRUD ==========
async function cargarNoticias() {
    try {
        const q = query(collection(db, 'noticias'), orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            noticiasList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>No hay noticias publicadas</p>
                </div>
            `;
            return;
        }
        
        noticiasList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const noticia = doc.data();
            noticiasList.innerHTML += `
                <div class="item">
                    <div class="item-content">
                        <div class="item-icon">${noticia.icon}</div>
                        <div class="item-date">${noticia.fecha}</div>
                        <h3 class="item-title">${noticia.titulo}</h3>
                        <p class="item-description">${noticia.descripcion}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editarNoticia('${doc.id}', ${JSON.stringify(noticia).replace(/"/g, '&quot;')})">✏️ Editar</button>
                        <button class="btn-delete" onclick="eliminarNoticia('${doc.id}')">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error al cargar noticias:', error);
    }
}

noticiaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const noticiaId = document.getElementById('noticiaId').value;
    const noticia = {
        titulo: document.getElementById('noticiaTitulo').value,
        descripcion: document.getElementById('noticiaDescripcion').value,
        fecha: document.getElementById('noticiaFecha').value,
        icon: document.getElementById('noticiaIcon').value
    };
    
    try {
        if (noticiaId) {
            await updateDoc(doc(db, 'noticias', noticiaId), noticia);
        } else {
            await addDoc(collection(db, 'noticias'), noticia);
        }
        
        noticiaModal.classList.remove('active');
        cargarNoticias();
    } catch (error) {
        console.error('Error al guardar noticia:', error);
        alert('Error al guardar la noticia');
    }
});

window.editarNoticia = (id, noticia) => {
    document.getElementById('noticiaId').value = id;
    document.getElementById('noticiaTitulo').value = noticia.titulo;
    document.getElementById('noticiaDescripcion').value = noticia.descripcion;
    document.getElementById('noticiaFecha').value = noticia.fecha;
    document.getElementById('noticiaIcon').value = noticia.icon;
    document.getElementById('noticiaModalTitle').textContent = 'Editar Noticia';
    noticiaModal.classList.add('active');
};

window.eliminarNoticia = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
        try {
            await deleteDoc(doc(db, 'noticias', id));
            cargarNoticias();
        } catch (error) {
            console.error('Error al eliminar noticia:', error);
            alert('Error al eliminar la noticia');
        }
    }
};

// ========== PRÉDICAS CRUD ==========
async function cargarPredicas() {
    try {
        const q = query(collection(db, 'predicas'), orderBy('fecha', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            predicasList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>No hay prédicas publicadas</p>
                </div>
            `;
            return;
        }
        
        predicasList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const p = doc.data();
            
            // Construir HTML del video si existe
            const videoHTML = p.videoId ? `
                <div style="margin-top: 1rem;">
                    <a href="https://www.youtube.com/watch?v=${p.videoId}" 
                       target="_blank" 
                       style="display: inline-flex; align-items: center; gap: 0.5rem; color: #ff0000; text-decoration: none; font-weight: 600;">
                        ▶️ Ver en YouTube
                    </a>
                </div>
            ` : '';
            
            predicasList.innerHTML += `
                <div class="item">
                    <div class="item-content">
                        <div class="item-icon">🎤</div>
                        <div class="item-predicador">${p.predicador}</div>
                        <div class="item-date">${p.fecha}</div>
                        <div class="item-title">${p.titulo}</div>
                        <div class="item-description">${p.descripcion}</div>
                        ${videoHTML}
                    </div>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editarPredica('${doc.id}', ${JSON.stringify(p).replace(/"/g, '&quot;')})">✏️ Editar</button>
                        <button class="btn-delete" onclick="eliminarPredica('${doc.id}')">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error al cargar prédicas:', error);
    }
}

predicaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const predicaId = document.getElementById('predicaId').value;
    const predica = {
        titulo: document.getElementById('predicaTitulo').value,
        predicador: document.getElementById('predicaPredicador').value,
        fecha: document.getElementById('predicaFecha').value,
        videoId: extractYouTubeID(document.getElementById('predicaVideoUrl').value),
        descripcion: document.getElementById('predicaDescripcion').value
    };
    
    try {
        if (predicaId) {
            await updateDoc(doc(db, 'predicas', predicaId), predica);
        } else {
            await addDoc(collection(db, 'predicas'), predica);
        }
        
        predicaModal.classList.remove('active');
        cargarPredicas();
    } catch (error) {
        console.error('Error al guardar prédica:', error);
        alert('Error al guardar la prédica');
    }
});

window.editarPredica = (id, predica) => {
    document.getElementById('predicaId').value = id;
    document.getElementById('predicaTitulo').value = predica.titulo;
    document.getElementById('predicaPredicador').value = predica.predicador;
    document.getElementById('predicaFecha').value = predica.fecha;
    document.getElementById('predicaVideoUrl').value = predica.videoId || '';
    document.getElementById('predicaDescripcion').value = predica.descripcion;
    document.getElementById('predicaModalTitle').textContent = 'Editar Prédica';
    predicaModal.classList.add('active');
};

window.eliminarPredica = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta prédica?')) {
        try {
            await deleteDoc(doc(db, 'predicas', id));
            cargarPredicas();
        } catch (error) {
            console.error('Error al eliminar prédica:', error);
            alert('Error al eliminar la prédica');
        }
    }
};

// ========== DEVOCIONALES MANAGEMENT ========== 
const addDevocionalBtn = document.getElementById('addDevocionalBtn');
const devocionalModal = document.getElementById('devocionalModal');
const closeDevocionalModal = document.getElementById('closeDevocionalModal');
const devocionalForm = document.getElementById('devocionalForm');
const devocionalesList = document.getElementById('devocionalesList');

// Abrir modal para nuevo devocional
addDevocionalBtn?.addEventListener('click', () => {
    devocionalForm.reset();
    document.getElementById('devocionalId').value = '';
    document.getElementById('devocionalModalTitle').textContent = 'Nuevo Devocional';
    devocionalModal.classList.add('active');
});

// Cerrar modal
closeDevocionalModal?.addEventListener('click', () => {
    devocionalModal.classList.remove('active');
});

// Cerrar modal al hacer click fuera
devocionalModal?.addEventListener('click', (e) => {
    if (e.target === devocionalModal) {
        devocionalModal.classList.remove('active');
    }
});

// Cargar devocionales
async function loadDevocionales() {
    try {
        const q = query(collection(db, 'devocionales'), orderBy('fecha', 'desc'));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            devocionalesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>No hay devocionales publicados</p>
                </div>
            `;
            return;
        }

        devocionalesList.innerHTML = '';
        snapshot.forEach(doc => {
            const devocional = doc.data();
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div class="item-content">
                    <div class="item-icon">📖</div>
                    <div class="item-date">${devocional.fecha}</div>
                    <div class="item-predicador">Por ${devocional.autor}</div>
                    <div class="item-title">${devocional.versiculo}</div>
                    <div class="item-description">${devocional.textoVersiculo.substring(0, 150)}...</div>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editDevocional('${doc.id}')">✏️ Editar</button>
                    <button class="btn-delete" onclick="deleteDevocional('${doc.id}')">🗑️ Eliminar</button>
                </div>
            `;
            devocionalesList.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading devocionales:', error);
    }
}

// Guardar devocional
devocionalForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const devocionalId = document.getElementById('devocionalId').value;
    const devocionalData = {
        fecha: document.getElementById('devocionalFecha').value,
        autor: document.getElementById('devocionalAutor').value,
        versiculo: document.getElementById('devocionalVersiculo').value,
        textoVersiculo: document.getElementById('devocionalTextoVersiculo').value,
        reflexion: document.getElementById('devocionalReflexion').value,
        oracion: document.getElementById('devocionalOracion').value,
        timestamp: new Date()
    };

    try {
        if (devocionalId) {
            await updateDoc(doc(db, 'devocionales', devocionalId), devocionalData);
        } else {
            await addDoc(collection(db, 'devocionales'), devocionalData);
        }
        
        devocionalModal.classList.remove('active');
        devocionalForm.reset();
        loadDevocionales();
    } catch (error) {
        console.error('Error saving devocional:', error);
        alert('Error al guardar el devocional');
    }
});

// Editar devocional
window.editDevocional = async (id) => {
    try {
        const docSnap = await getDoc(doc(db, 'devocionales', id));
        if (docSnap.exists()) {
            const devocional = docSnap.data();
            document.getElementById('devocionalId').value = id;
            document.getElementById('devocionalFecha').value = devocional.fecha;
            document.getElementById('devocionalAutor').value = devocional.autor;
            document.getElementById('devocionalVersiculo').value = devocional.versiculo;
            document.getElementById('devocionalTextoVersiculo').value = devocional.textoVersiculo;
            document.getElementById('devocionalReflexion').value = devocional.reflexion;
            document.getElementById('devocionalOracion').value = devocional.oracion;
            document.getElementById('devocionalModalTitle').textContent = 'Editar Devocional';
            devocionalModal.classList.add('active');
        }
    } catch (error) {
        console.error('Error loading devocional:', error);
    }
};

// Eliminar devocional
window.deleteDevocional = async (id) => {
    if (confirm('¿Estás seguro de eliminar este devocional?')) {
        try {
            await deleteDoc(doc(db, 'devocionales', id));
            loadDevocionales();
        } catch (error) {
            console.error('Error deleting devocional:', error);
        }
    }
};
