const API_URL = 'http://localhost:5555';

//formulaire
document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();//evite de recharger la page
    

    //etiquettes en tableau
    const messageDiv = document.getElementById('message');
    const etiquettes = document.getElementById('etiquettes').value
        .split(',').map(e => e.trim()).filter(e => e);


       //on cree l'obj tache qu'on envoie au back 
    const taskData = {
        titre: document.getElementById('titre').value,
        description: document.getElementById('description').value,
        statut: document.getElementById('statut').value,
        priorite: document.getElementById('priorite').value,
        categorie: document.getElementById('categorie').value,
        echeance: document.getElementById('echeance').value || null,
        etiquettes,
        auteur: {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value
        }
    };

    try {
        //send la req post pour creer new tache
        const response = await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error('Erreur création');
        
        //on recup la tache  creee
        const newTask = await response.json();
        messageDiv.textContent = 'Tâche créée';
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';
        
        //redirection
        setTimeout(() => window.location.href = `/taskInfo/${newTask._id}`, 1500);

    } catch (error) {
        messageDiv.textContent = 'Erreur lors de la création';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
    }
});