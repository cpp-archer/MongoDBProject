//url de l'api backend
const API_URL = 'http://localhost:5555';

//on load les stats
document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
});

//on recupere les taches pour calculer les stats
async function loadStats() {
    try {
        //recuperation des taches
        const response = await fetch(`${API_URL}/api/tasks`);
        const tasks = await response.json();
        
        //calcul
        const total = tasks.length;
        const completed = tasks.filter(t => t.statut === 'Terminée').length;
        const inProgress = tasks.filter(t => t.statut === 'En cours').length;
        const pending = tasks.filter(t => t.statut === 'En attente').length;
        
        //mise a jour avec valeurs calculé
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('inProgressTasks').textContent = inProgress;
        document.getElementById('pendingTasks').textContent = pending;
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}