const API_URL = 'http://localhost:5555';

document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
});

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        const tasks = await response.json();
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.statut === 'Terminée').length;
        const inProgress = tasks.filter(t => t.statut === 'En cours').length;
        const pending = tasks.filter(t => t.statut === 'En attente').length;
        
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('inProgressTasks').textContent = inProgress;
        document.getElementById('pendingTasks').textContent = pending;
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}