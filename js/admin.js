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


// ========== FUNCIÓN PARA CONVERTIR URL DE GOOGLE DRIVE ==========
function convertGoogleDriveUrl(url) {
    if (!url) return '';
    
    // Si es un enlace de compartir: https://drive.google.com/file/d/FILE_ID/view
    const shareMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (shareMatch) {
        return `https://drive.google.com/thumbnail?id=${shareMatch[1]}&sz=w800`;
    }
    
    // Si ya es un thumbnail directo
    if (url.includes('drive.google.com/thumbnail')) {
        return url;
    }
    
    // Si es solo el ID
    if (/^[a-zA-Z0-9_-]+$/.test(url)) {
        return `https://drive.google.com/thumbnail?id=${url}&sz=w800`;
    }
    
    return url;
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
    getDoc, 
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
const devocionalModal = document.getElementById('devocionalModal');


// Botones
const addNoticiaBtn = document.getElementById('addNoticiaBtn');
const addPredicaBtn = document.getElementById('addPredicaBtn');
const addDevocionalBtn = document.getElementById('addDevocionalBtn');
const closeNoticiaModal = document.getElementById('closeNoticiaModal');
const closePredicaModal = document.getElementById('closePredicaModal');
const closeDevocionalModal = document.getElementById('closeDevocionalModal');


// Formularios
const noticiaForm = document.getElementById('noticiaForm');
const predicaForm = document.getElementById('predicaForm');
const devocionalForm = document.getElementById('devocionalForm');

// Listas
const noticiasList = document.getElementById('noticiasList');
const predicasList = document.getElementById('predicasList');
const devocionalesList = document.getElementById('devocionalesList');

// Preview de imagen
const noticiaImageUrlInput = document.getElementById('noticiaImageUrl');
const noticiaImagenPreview = document.getElementById('noticiaImagenPreview');
const noticiaImagenPreviewImg = document.getElementById('noticiaImagenPreviewImg');


// ========== AUTENTICACIÓN ==========
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginScreen.style.display = 'none';
        dashboard.classList.add('active');
        userEmail.textContent = user.email;
        cargarNoticias();
        cargarPredicas();
        loadDevocionales();
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
    noticiaImagenPreview.style.display = 'none';
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


// ========== PREVIEW DE IMAGEN ==========
noticiaImageUrlInput?.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
        const convertedUrl = convertGoogleDriveUrl(url);
        noticiaImagenPreviewImg.src = convertedUrl;
        noticiaImagenPreview.style.display = 'block';
        
        // Ocultar preview si la imagen falla al cargar
        noticiaImagenPreviewImg.onerror = () => {
            noticiaImagenPreview.style.display = 'none';
        };
    } else {
        noticiaImagenPreview.style.display = 'none';
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
            
            // Preview de imagen en la lista
            const imagePreview = noticia.imageUrl ? `
                <img src="${noticia.imageUrl}" 
                     alt="${noticia.titulo}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 1rem;">
            ` : `<div class="item-icon">${noticia.icon}</div>`;
            
            noticiasList.innerHTML += `
                <div class="item">
                    <div class="item-content" style="display: flex; align-items: center;">
                        ${imagePreview}
                        <div>
                            <div class="item-date">${noticia.fecha}</div>
                            <h3 class="item-title">${noticia.titulo}</h3>
                            <p class="item-description">${noticia.descripcion}</p>
                        </div>
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


noticiaForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('noticiaId').value;
    const imageUrl = document.getElementById('noticiaImageUrl').value.trim();
    
    try {
        const noticiaData = {
            fecha: document.getElementById('noticiaFecha').value,
            icon: document.getElementById('noticiaIcon').value,
            titulo: document.getElementById('noticiaTitulo').value,
            descripcion: document.getElementById('noticiaDescripcion').value,
            imageUrl: convertGoogleDriveUrl(imageUrl)
        };
        
        if (id) {
            await updateDoc(doc(db, 'noticias', id), noticiaData);
            alert('✅ Noticia actualizada exitosamente');
        } else {
            await addDoc(collection(db, 'noticias'), noticiaData);
            alert('✅ Noticia creada exitosamente');
        }
        
        noticiaModal.classList.remove('active');
        noticiaForm.reset();
        noticiaImagenPreview.style.display = 'none';
        cargarNoticias();  // ✅ CORREGIDO: era loadNoticias()
        
    } catch (error) {
        console.error('Error saving noticia:', error);
        alert('❌ Error al guardar la noticia: ' + error.message);
    }
});


window.editarNoticia = (id, noticia) => {
    document.getElementById('noticiaId').value = id;
    document.getElementById('noticiaTitulo').value = noticia.titulo;
    document.getElementById('noticiaDescripcion').value = noticia.descripcion;
    document.getElementById('noticiaFecha').value = noticia.fecha;
    document.getElementById('noticiaIcon').value = noticia.icon;
    document.getElementById('noticiaImageUrl').value = noticia.imageUrl || '';
    
    // Mostrar preview si hay imagen
    if (noticia.imageUrl) {
        noticiaImagenPreviewImg.src = noticia.imageUrl;
        noticiaImagenPreview.style.display = 'block';
    }
    
    document.getElementById('noticiaModalTitle').textContent = 'Editar Noticia';
    noticiaModal.classList.add('active');
};


window.eliminarNoticia = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
        try {
            await deleteDoc(doc(db, 'noticias', id));
            alert('✅ Noticia eliminada');
            cargarNoticias();
        } catch (error) {
            console.error('Error al eliminar noticia:', error);
            alert('❌ Error al eliminar la noticia');
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
            alert('✅ Prédica actualizada');
        } else {
            await addDoc(collection(db, 'predicas'), predica);
            alert('✅ Prédica creada');
        }
        
        predicaModal.classList.remove('active');
        cargarPredicas();
    } catch (error) {
        console.error('Error al guardar prédica:', error);
        alert('❌ Error al guardar la prédica');
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
            alert('✅ Prédica eliminada');
            cargarPredicas();
        } catch (error) {
            console.error('Error al eliminar prédica:', error);
            alert('❌ Error al eliminar la prédica');
        }
    }
};


// ========== DEVOCIONALES CRUD ==========
addDevocionalBtn?.addEventListener('click', () => {
    devocionalForm.reset();
    document.getElementById('devocionalId').value = '';
    document.getElementById('devocionalModalTitle').textContent = 'Nuevo Devocional';
    devocionalModal.classList.add('active');
});


closeDevocionalModal?.addEventListener('click', () => {
    devocionalModal.classList.remove('active');
});


devocionalModal?.addEventListener('click', (e) => {
    if (e.target === devocionalModal) {
        devocionalModal.classList.remove('active');
    }
});


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
            alert('✅ Devocional actualizado');
        } else {
            await addDoc(collection(db, 'devocionales'), devocionalData);
            alert('✅ Devocional creado');
        }
        
        devocionalModal.classList.remove('active');
        devocionalForm.reset();
        loadDevocionales();
    } catch (error) {
        console.error('Error saving devocional:', error);
        alert('❌ Error al guardar el devocional');
    }
});


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


window.deleteDevocional = async (id) => {
    if (confirm('¿Estás seguro de eliminar este devocional?')) {
        try {
            await deleteDoc(doc(db, 'devocionales', id));
            alert('✅ Devocional eliminado');
            loadDevocionales();
        } catch (error) {
            console.error('Error deleting devocional:', error);
            alert('❌ Error al eliminar');
        }
    }
};
