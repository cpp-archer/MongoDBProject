let currentTask = null;
let taskId = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer l'ID de la tâche depuis l'URL
    const pathParts = window.location.pathname.split('/');
    taskId = pathParts[pathParts.length - 1];

    await loadTaskDetails();
    setupEventListeners();
});

async function loadTaskDetails() {
    try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error('Tâche non trouvée');
        }
        
        currentTask = await response.json();
        displayTaskDetails();
        displaySubtasks();
        displayComments();

    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('taskDetails').innerHTML = 
            '<div class="error">❌ Erreur lors du chargement de la tâche</div>';
    }
}

function displayTaskDetails() {
    const container = document.getElementById('taskDetails');
    const dateCreation = new Date(currentTask.dateCreation).toLocaleDateString('fr-FR');
    const echeance = currentTask.echeance 
        ? new Date(currentTask.echeance).toLocaleDateString('fr-FR') 
        : 'Non définie';

    const statutClass = currentTask.statut.toLowerCase().replace(' ', '-');
    const prioriteClass = currentTask.priorite ? currentTask.priorite.toLowerCase() : '';

    const auteurInfo = currentTask.auteur && (currentTask.auteur.nom || currentTask.auteur.prenom)
        ? `${currentTask.auteur.prenom || ''} ${currentTask.auteur.nom || ''} ${currentTask.auteur.email ? `(${currentTask.auteur.email})` : ''}`
        : 'Non spécifié';

    const etiquettes = currentTask.etiquettes && currentTask.etiquettes.length > 0
        ? currentTask.etiquettes.map(e => `<span class="etiquette">${e}</span>`).join('')
        : 'Aucune';

    container.innerHTML = `
        <h2>${currentTask.titre || 'Sans titre'}</h2>
        
        <div class="detail-row">
            <strong>📝 Description:</strong>
            <div>${currentTask.description || 'Pas de description'}</div>
        </div>

        <div class="detail-row">
            <strong>📊 Statut:</strong>
            <span class="badge badge-statut ${statutClass}">${currentTask.statut}</span>
        </div>

        <div class="detail-row">
            <strong>⚡ Priorité:</strong>
            ${currentTask.priorite ? `<span class="badge badge-priorite ${prioriteClass}">${currentTask.priorite}</span>` : 'Non définie'}
        </div>

        <div class="detail-row">
            <strong>📁 Catégorie:</strong>
            ${currentTask.categorie ? `<span class="badge badge-categorie">${currentTask.categorie}</span>` : 'Aucune'}
        </div>

        <div class="detail-row">
            <strong>📅 Date de création:</strong>
            ${dateCreation}
        </div>

        <div class="detail-row">
            <strong>⏰ Échéance:</strong>
            ${echeance}
        </div>

        <div class="detail-row">
            <strong>👤 Auteur:</strong>
            ${auteurInfo}
        </div>

        <div class="detail-row">
            <strong>🏷️ Étiquettes:</strong>
            <div class="task-etiquettes">${etiquettes}</div>
        </div>
    `;
}

function displaySubtasks() {
    const container = document.getElementById('subtasksList');
    
    if (!currentTask.sousTaches || currentTask.sousTaches.length === 0) {
        container.innerHTML = '<p style="color: #666;">Aucune sous-tâche pour le moment</p>';
        return;
    }

    container.innerHTML = currentTask.sousTaches.map((subtask, index) => `
        <div class="subtask-item">
            <h4>${subtask.titre || 'Sans titre'}</h4>
            ${subtask.description ? `<p>${subtask.description}</p>` : ''}
            <span class="badge badge-statut ${(subtask.statut || '').toLowerCase().replace(' ', '-')}">
                ${subtask.statut || 'En attente'}
            </span>
        </div>
    `).join('');
}

function displayComments() {
    const container = document.getElementById('commentsList');
    
    if (!currentTask.commentaires || currentTask.commentaires.length === 0) {
        container.innerHTML = '<p style="color: #666;">Aucun commentaire pour le moment</p>';
        return;
    }

    container.innerHTML = currentTask.commentaires.map(comment => {
        const date = comment.date ? new Date(comment.date).toLocaleString('fr-FR') : 'Date inconnue';
        return `
            <div class="comment-item">
                <div class="comment-author">${comment.auteur || 'Anonyme'}</div>
                <div class="comment-date">${date}</div>
                <div class="comment-text">${comment.texte || ''}</div>
            </div>
        `;
    }).join('');
}

function setupEventListeners() {
    // Bouton modifier
    document.getElementById('editBtn').addEventListener('click', () => {
        showEditForm();
    });

    // Bouton supprimer
    document.getElementById('deleteBtn').addEventListener('click', async () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            await deleteTask();
        }
    });

    // Bouton annuler modification
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        hideEditForm();
    });

    // Formulaire de modification
    document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateTask();
    });

    // Formulaire d'ajout de sous-tâche
    document.getElementById('addSubtaskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await addSubtask();
    });

    // Formulaire d'ajout de commentaire
    document.getElementById('addCommentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await addComment();
    });
}

function showEditForm() {
    document.getElementById('taskDetails').style.display = 'none';
    document.getElementById('editTaskForm').style.display = 'block';

    // Remplir le formulaire avec les données actuelles
    document.getElementById('editTitre').value = currentTask.titre || '';
    document.getElementById('editDescription').value = currentTask.description || '';
    document.getElementById('editStatut').value = currentTask.statut || '';
    document.getElementById('editPriorite').value = currentTask.priorite || '';
    document.getElementById('editCategorie').value = currentTask.categorie || '';
    
    if (currentTask.echeance) {
        const date = new Date(currentTask.echeance);
        document.getElementById('editEcheance').value = date.toISOString().split('T')[0];
    }
}

function hideEditForm() {
    document.getElementById('taskDetails').style.display = 'block';
    document.getElementById('editTaskForm').style.display = 'none';
}

async function updateTask() {
    const updatedData = {
        titre: document.getElementById('editTitre').value,
        description: document.getElementById('editDescription').value,
        statut: document.getElementById('editStatut').value,
        priorite: document.getElementById('editPriorite').value,
        categorie: document.getElementById('editCategorie').value,
        echeance: document.getElementById('editEcheance').value || null
    };

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('✅ Tâche mise à jour avec succès !');
            await loadTaskDetails();
            hideEditForm();
        } else {
            throw new Error('Erreur lors de la mise à jour');
        }

    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de la mise à jour de la tâche');
    }
}

async function deleteTask() {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('✅ Tâche supprimée avec succès !');
            window.location.href = '/TasksList';
        } else {
            throw new Error('Erreur lors de la suppression');
        }

    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de la suppression de la tâche');
    }
}

async function addSubtask() {
    const subtaskData = {
        titre: document.getElementById('subtaskTitle').value,
        description: document.getElementById('subtaskDescription').value,
        statut: document.getElementById('subtaskStatut').value
    };

    try {
        const response = await fetch(`/api/tasks/${taskId}/sous-taches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subtaskData)
        });

        if (response.ok) {
            await loadTaskDetails();
            document.getElementById('addSubtaskForm').reset();
            alert('✅ Sous-tâche ajoutée avec succès !');
        } else {
            throw new Error('Erreur lors de l\'ajout de la sous-tâche');
        }

    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de l\'ajout de la sous-tâche');
    }
}

async function addComment() {
    const commentData = {
        auteur: document.getElementById('commentAuteur').value,
        texte: document.getElementById('commentTexte').value,
        date: new Date().toISOString()
    };

    try {
        const response = await fetch(`/api/tasks/${taskId}/commentaires`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            await loadTaskDetails();
            document.getElementById('addCommentForm').reset();
            alert('✅ Commentaire ajouté avec succès !');
        } else {
            throw new Error('Erreur lors de l\'ajout du commentaire');
        }

    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de l\'ajout du commentaire');
    }
}