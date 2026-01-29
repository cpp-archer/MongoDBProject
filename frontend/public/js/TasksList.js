const API_URL = 'http://localhost:5555';

//tab de toute les taches
let allTasks = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    setupFilters();
});

//load de puis l'api
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        allTasks = await response.json();
        displayTasks(allTasks);
    } catch (error) {
        document.getElementById('tasksContainer').innerHTML = '<div>Erreur de chargement</div>';
    }
}


//affichage des taches sous forme de carte
function displayTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    const noTasksDiv = document.getElementById('noTasks');

    if (!tasks.length) {
        container.style.display = 'none';
        noTasksDiv.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    noTasksDiv.style.display = 'none';
    container.innerHTML = tasks.map(t => `
        <div class="task-card" data-id="${t._id}" onclick="location.href='/taskInfo/${t._id}'">
            <h3>${t.titre || 'Sans titre'}</h3>
            <p>${t.description?.substring(0, 80) || 'Pas de description'}${t.description?.length > 80 ? '...' : ''}</p>
            <div class="task-meta">
                <span class="badge">${t.statut}</span>
                ${t.priorite ? `<span class="badge">${t.priorite}</span>` : ''}
            </div>
            <div class="task-date">📅 ${new Date(t.dateCreation).toLocaleDateString('fr-FR')}</div>
        </div>
    `).join('');
}

function setupFilters() {
    const els = ['filterStatut', 'filterPriorite', 'filterCategorie', 'sortBy', 'searchText']
        .map(id => document.getElementById(id));

    els.forEach(el => el.addEventListener(el.type === 'text' ? 'input' : 'change', applyFilters));
    
    document.getElementById('resetFilters').addEventListener('click', () => {
        els.forEach((el, i) => el.value = i === 3 ? 'dateCreation' : '');
        applyFilters();
    });
}

function applyFilters() {
    let filtered = [...allTasks];
    const [statut, priorite, categorie, sortBy, search] = 
        ['filterStatut', 'filterPriorite', 'filterCategorie', 'sortBy', 'searchText']
        .map(id => document.getElementById(id).value);

    if (statut) filtered = filtered.filter(t => t.statut === statut);
    if (priorite) filtered = filtered.filter(t => t.priorite === priorite);
    if (categorie) filtered = filtered.filter(t => t.categorie === categorie);
    if (search) filtered = filtered.filter(t => 
        t.titre?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
        if (sortBy === 'dateCreation') return new Date(b.dateCreation) - new Date(a.dateCreation);
        if (sortBy === 'echeance') return (a.echeance || '9999') > (b.echeance || '9999') ? 1 : -1;
        if (sortBy === 'priorite') return ({'Haute': 0, 'Moyenne': 1, 'Basse': 2}[a.priorite] || 3) - 
                                           ({'Haute': 0, 'Moyenne': 1, 'Basse': 2}[b.priorite] || 3);
        if (sortBy === 'titre') return (a.titre || '').localeCompare(b.titre || '');
        return 0;
    });

    displayTasks(filtered);
}