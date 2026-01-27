document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createTaskForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createTask();
    });
});

async function createTask() {
    const form = document.getElementById('createTaskForm');
    const messageDiv = document.getElementById('message');

    // Récupérer les données du formulaire
    const etiquettesInput = document.getElementById('etiquettes').value;
    const etiquettes = etiquettesInput 
        ? etiquettesInput.split(',').map(e => e.trim()).filter(e => e)
        : [];

    const taskData = {
        titre: document.getElementById('titre').value,
        description: document.getElementById('description').value,
        statut: document.getElementById('statut').value,
        priorite: document.getElementById('priorite').value,
        categorie: document.getElementById('categorie').value,
        echeance: document.getElementById('echeance').value || null,
        etiquettes: etiquettes,
        auteur: {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value
        },
        sousTaches: [],
        commentaires: [],
        historiqueModifications: []
    };

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const newTask = await response.json();
            
            // Afficher un message de succès
            messageDiv.textContent = '✅ Tâche créée avec succès !';
            messageDiv.className = 'message success';
            messageDiv.style.display = 'block';

            // Réinitialiser le formulaire
            form.reset();

            // Rediriger vers la page de détails après 1.5 secondes
            setTimeout(() => {
                window.location.href = `/taskInfo/${newTask._id}`;
            }, 1500);

        } else {
            throw new Error('Erreur lors de la création de la tâche');
        }

    } catch (error) {
        console.error('Erreur:', error);
        messageDiv.textContent = '❌ Erreur lors de la création de la tâche. Veuillez réessayer.';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    }
}