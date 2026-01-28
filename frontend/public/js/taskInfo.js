const API_URL = 'http://localhost:5555';
const $ = id => document.getElementById(id);

let currentTask, taskId;

document.addEventListener('DOMContentLoaded', async () => {
    taskId = window.location.pathname.split('/').pop();
    await load();
    setup();
});

async function load() {
    try {
        currentTask = await (await fetch(`${API_URL}/api/tasks/${taskId}`)).json();
        const t = currentTask;
        
        $('taskDetails').innerHTML = `
            <h2>${t.titre || 'Sans titre'}</h2>
            <div><strong>Description:</strong> ${t.description || 'Aucune'}</div>
            <div><strong>Statut:</strong> ${t.statut} | <strong>Priorité:</strong> ${t.priorite || 'Aucune'}</div>
            <div><strong>Catégorie:</strong> ${t.categorie || 'Aucune'} | <strong>Création:</strong> ${new Date(t.dateCreation).toLocaleDateString()}</div>
            ${t.echeance ? `<div><strong>Échéance:</strong> ${new Date(t.echeance).toLocaleDateString()}</div>` : ''}
        `;
        
        $('subtasksList').innerHTML = t.sousTaches?.length 
            ? t.sousTaches.map(st => `<div class="subtask-item"><h4>${st.titre}</h4><span>${st.statut}</span></div>`).join('')
            : '<p>Aucune</p>';
        
        $('commentsList').innerHTML = t.commentaires?.length
            ? t.commentaires.map(c => `<div class="comment-item"><strong>${c.auteur}</strong><p>${c.texte}</p></div>`).join('')
            : '<p>Aucun</p>';
    } catch {
        $('taskDetails').innerHTML = '<div>Erreur</div>';
    }
}

function setup() {
    $('editBtn').onclick = () => {
        $('taskDetails').style.display = 'none';
        $('editTaskForm').style.display = 'block';
        ['Titre', 'Description', 'Statut', 'Priorite', 'Categorie'].forEach(f => 
            $('edit' + f).value = currentTask[f.toLowerCase()] || ''
        );
        $('editEcheance').value = currentTask.echeance?.split('T')[0] || '';
    };

    $('deleteBtn').onclick = async () => {
        if (confirm('Supprimer ?') && (await fetch(`${API_URL}/api/tasks/${taskId}`, {method: 'DELETE'})).ok) 
            location.href = '/TasksList';
    };

    $('cancelEditBtn').onclick = () => {
        $('taskDetails').style.display = 'block';
        $('editTaskForm').style.display = 'none';
    };

    $('editTaskForm').onsubmit = e => save(e, `${API_URL}/api/tasks/${taskId}`, 'PUT', {
        titre: $('editTitre').value,
        description: $('editDescription').value,
        statut: $('editStatut').value,
        priorite: $('editPriorite').value,
        categorie: $('editCategorie').value,
        echeance: $('editEcheance').value || null
    });

    $('addSubtaskForm').onsubmit = e => save(e, `${API_URL}/api/tasks/${taskId}/sous-taches`, 'POST', {
        titre: $('subtaskTitle').value,
        description: $('subtaskDescription').value,
        statut: $('subtaskStatut').value
    });

    $('addCommentForm').onsubmit = e => save(e, `${API_URL}/api/tasks/${taskId}/commentaires`, 'POST', {
        auteur: $('commentAuteur').value,
        texte: $('commentTexte').value,
        date: new Date().toISOString()
    });
}

async function save(e, url, method, data) {
    e.preventDefault();
    if ((await fetch(url, {method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})).ok) {
        await load();
        e.target.reset();
        if (method === 'PUT') {
            $('taskDetails').style.display = 'block';
            $('editTaskForm').style.display = 'none';
        }
    }
}