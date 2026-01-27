let allTasks = [];

// Charger les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    setupFilters();
});

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        allTasks = await response.json();
        displayTasks(allTasks);
    } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
        document.getElementById('tasksContainer').innerHTML = 
            '<div class="error">Erreur lors du chargement des tâches</div>';
    }
}

function displayTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    const noTasksDiv = document.getElementById('noTasks');

    if (tasks.length === 0) {
        container.style.display = 'none';
        noTasksDiv.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    noTasksDiv.style.display = 'none';

    container.innerHTML = tasks.map(task => createTaskCard(task)).join('');

    // Ajouter les événements de clic
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', () => {
            const taskId = card.dataset.id;
            window.location.href = `/taskInfo/${taskId}`;
        });
    });
}

function createTaskCard(task) {
    const dateCreation = new Date(task.dateCreation).toLocaleDateString('fr-FR');
    const echeance = task.echeance ? new Date(task.echeance).toLocaleDateString('fr-FR') : 'Non définie';
    
    const statutClass = task.statut.toLowerCase().replace(' ', '-');
    const prioriteClass = task.priorite ? task.priorite.toLowerCase() : '';

    const etiquettes = task.etiquettes && task.etiquettes.length > 0
        ? `<div class="task-etiquettes">
             ${task.etiquettes.map(e => `<span class="etiquette">${e}</span>`).join('')}
           </div>`
        : '';

    const sousTachesInfo = task.sousTaches && task.sousTaches.length > 0
        ? `<div style="font-size: 0.9em; color: #666;">📌 ${task.sousTaches.length} sous-tâche(s)</div>`
        : '';

    const commentairesInfo = task.commentaires && task.commentaires.length > 0
        ? `<div style="font-size: 0.9em; color: #666;">💬 ${task.commentaires.length} commentaire(s)</div>`
        : '';

    return `
        <div class="task-card" data-id="${task._id}">
            <h3>${task.titre || 'Sans titre'}</h3>
            <p>${task.description ? (task.description.substring(0, 100) + (task.description.length > 100 ? '...' : '')) : 'Pas de description'}</p>
            
            <div class="task-meta">
                <span class="badge badge-statut ${statutClass}">${task.statut || 'Non défini'}</span>
                ${task.priorite ? `<span class="badge badge-priorite ${prioriteClass}">${task.priorite}</span>` : ''}
                ${task.categorie ? `<span class="badge badge-categorie">${task.categorie}</span>` : ''}
            </div>

            ${etiquettes}
            ${sousTachesInfo}
            ${commentairesInfo}

            <div class="task-date">
                <div>📅 Créée le: ${dateCreation}</div>
                ${task.echeance ? `<div>⏰ Échéance: ${echeance}</div>` : ''}
            </div>
        </div>
    `;
}

function setupFilters() {
    const filterStatut = document.getElementById('filterStatut');
    const filterPriorite = document.getElementById('filterPriorite');
    const filterCategorie = document.getElementById('filterCategorie');
    const sortBy = document.getElementById('sortBy');
    const searchText = document.getElementById('searchText');
    const resetBtn = document.getElementById('resetFilters');

    [filterStatut, filterPriorite, filterCategorie, sortBy, searchText].forEach(element => {
        element.addEventListener('change', applyFilters);
        if (element.tagName === 'INPUT') {
            element.addEventListener('input', applyFilters);
        }
    });

    resetBtn.addEventListener('click', () => {
        filterStatut.value = '';
        filterPriorite.value = '';
        filterCategorie.value = '';
        sortBy.value = 'dateCreation';
        searchText.value = '';
        applyFilters();
    });
}

function applyFilters() {
    let filteredTasks = [...allTasks];

    // Filtre par statut
    const statutFilter = document.getElementById('filterStatut').value;
    if (statutFilter) {
        filteredTasks = filteredTasks.filter(t => t.statut === statutFilter);
    }

    // Filtre par priorité
    const prioriteFilter = document.getElementById('filterPriorite').value;
    if (prioriteFilter) {
        filteredTasks = filteredTasks.filter(t => t.priorite === prioriteFilter);
    }

    // Filtre par catégorie
    const categorieFilter = document.getElementById('filterCategorie').value;
    if (categorieFilter) {
        filteredTasks = filteredTasks.filter(t => t.categorie === categorieFilter);
    }

    // Recherche textuelle
    const search = document.getElementById('searchText').value.toLowerCase();
    if (search) {
        filteredTasks = filteredTasks.filter(t => 
            (t.titre && t.titre.toLowerCase().includes(search)) ||
            (t.description && t.description.toLowerCase().includes(search))
        );
    }

    // Tri
    const sortValue = document.getElementById('sortBy').value;
    filteredTasks.sort((a, b) => {
        switch(sortValue) {
            case 'dateCreation':
                return new Date(b.dateCreation) - new Date(a.dateCreation);
            case 'echeance':
                if (!a.echeance) return 1;
                if (!b.echeance) return -1;
                return new Date(a.echeance) - new Date(b.echeance);
            case 'priorite':
                const prioriteOrder = { 'Haute': 0, 'Moyenne': 1, 'Basse': 2 };
                return (prioriteOrder[a.priorite] || 3) - (prioriteOrder[b.priorite] || 3);
            case 'titre':
                return (a.titre || '').localeCompare(b.titre || '');
            default:
                return 0;
        }
    });

    displayTasks(filteredTasks);
}