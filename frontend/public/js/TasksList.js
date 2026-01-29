const API_URL = 'http://localhost:5555';

document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    setupFilters();
});

/**
 * Construit l'URL avec les paramètres de filtrage
 * Cette fonction crée la query string pour l'API en fonction des filtres actifs
 */
function buildQueryParams() {
    const params = new URLSearchParams();
    
    // Récupération des valeurs des filtres
    const statut = document.getElementById('filterStatut').value;
    const priorite = document.getElementById('filterPriorite').value;
    const categorie = document.getElementById('filterCategorie').value;
    const etiquette = document.getElementById('filterEtiquette').value;
    const avant = document.getElementById('filterAvant').value;
    const apres = document.getElementById('filterApres').value;
    const search = document.getElementById('searchText').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;
    
    // Ajout des paramètres seulement s'ils ont une valeur
    if (statut) params.append('statut', statut);
    if (priorite) params.append('priorite', priorite);
    if (categorie) params.append('categorie', categorie);
    if (etiquette) params.append('etiquette', etiquette);
    if (avant) params.append('avant', avant);
    if (apres) params.append('apres', apres);
    if (search) params.append('q', search);
    if (sortBy) params.append('tri', sortBy);
    if (sortOrder) params.append('ordre', sortOrder);
    
    return params.toString();
}

/**
 * Charge les tâches depuis l'API avec les filtres appliqués
 * Envoie une requête GET avec les paramètres de filtrage dans l'URL
 */
//load depui l'API
async function loadTasks() {
    try {
        const queryParams = buildQueryParams();
        const url = `${API_URL}/api/tasks${queryParams ? '?' + queryParams : ''}`;
        
        console.log('Chargement depuis:', url); // Pour debug
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Erreur de chargement:', error);
        document.getElementById('tasksContainer').innerHTML = 
            '<div class="error">Erreur de chargement des tâches</div>';
    }
}

/**
 * Affiche les tâches sous forme de cartes
 * Gère également l'affichage du message "Aucune tâche"
 */
function displayTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    const noTasksDiv = document.getElementById('noTasks');

    // Si aucune tâche, affiche le message
    if (!tasks.length) {
        container.style.display = 'none';
        noTasksDiv.style.display = 'block';
        return;
    }

    // Affichage des tâches
    container.style.display = 'grid';
    noTasksDiv.style.display = 'none';
    container.innerHTML = tasks.map(t => `
        <div class="task-card" data-id="${t._id}" onclick="location.href='/taskInfo/${t._id}'">
            <h3>${t.titre || 'Sans titre'}</h3>
            <p>${t.description?.substring(0, 80) || 'Pas de description'}${t.description?.length > 80 ? '...' : ''}</p>
            <div class="task-meta">
                <span class="badge badge-${t.statut?.toLowerCase().replace(' ', '-')}">${t.statut}</span>
                ${t.priorite ? `<span class="badge badge-${t.priorite}">${t.priorite}</span>` : ''}
                ${t.categorie ? `<span class="badge badge-cat">${t.categorie}</span>` : ''}
            </div>
            ${t.echeance ? `<div class="task-date">📅 Échéance: ${new Date(t.echeance).toLocaleDateString('fr-FR')}</div>` : ''}
            ${t.etiquettes?.length ? `<div class="task-tags">${t.etiquettes.map(tag => `<span class="tag">#${tag}</span>`).join(' ')}</div>` : ''}
        </div>
    `).join('');
}

/**
 * Configure les écouteurs d'événements sur tous les filtres
 * Chaque changement déclenche un nouveau chargement depuis l'API
 */
function setupFilters() {
    const filterElements = [
        'filterStatut', 
        'filterPriorite', 
        'filterCategorie', 
        'filterEtiquette',
        'filterAvant',
        'filterApres',
        'sortBy',
        'sortOrder',
        'searchText'
    ];
    
    // Ajoute un écouteur sur chaque élément de filtre
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // 'input' pour les champs texte/date, 'change' pour les select
            const eventType = element.type === 'text' || element.type === 'date' ? 'input' : 'change';
            element.addEventListener(eventType, () => {
                // Délai pour la recherche textuelle (évite trop de requêtes)
                if (id === 'searchText') {
                    clearTimeout(element.searchTimeout);
                    element.searchTimeout = setTimeout(() => loadTasks(), 300);
                } else {
                    loadTasks();
                }
            });
        }
    });
    
    // Bouton de réinitialisation
    document.getElementById('resetFilters').addEventListener('click', () => {
        filterElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });
        // Réinitialise le tri par défaut
        document.getElementById('sortBy').value = 'dateCreation';
        document.getElementById('sortOrder').value = 'desc';
        loadTasks();
    });
}