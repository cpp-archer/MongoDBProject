// Charger les statistiques au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
});

async function loadStats() {
    try {
        const response = await fetch('/api/tasks');
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
        console.error('Erreur lors du chargement des statistiques:', error);
        document.getElementById('totalTasks').textContent = '0';
        document.getElementById('completedTasks').textContent = '0';
        document.getElementById('inProgressTasks').textContent = '0';
        document.getElementById('pendingTasks').textContent = '0';
    }
}