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
            const predica = doc.data();
            predicasList.innerHTML += `
                <div class="item">
                    <div class="item-content">
                        <div class="item-icon">🎤</div>
                        <h3 class="item-title">${predica.titulo}</h3>
                        <div class="item-predicador">${predica.predicador}</div>
                        <div class="item-date">${predica.fecha}</div>
                        <p class="item-description">${predica.descripcion}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editarPredica('${doc.id}', ${JSON.stringify(predica).replace(/"/g, '&quot;')})">✏️ Editar</button>
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
