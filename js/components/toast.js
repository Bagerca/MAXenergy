window.App = window.App || {};
window.App.components = window.App.components || {};

window.App.components.Toast = {
    show(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">${window.App.icons.cart}</div>
            <div class="toast-message">${message}</div>
        `;

        container.appendChild(toast);

        // Анимация появления
        setTimeout(() => toast.classList.add('show'), 10);

        // Авто-удаление через 3 секунды
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Ждем конца CSS-анимации
        }, 3000);
    }
};