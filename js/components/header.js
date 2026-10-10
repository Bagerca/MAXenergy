window.App = window.App || {};
window.App.components = window.App.components || {};

window.App.components.Header = {
    render() {
        const headerEl = document.getElementById('app-header');
        
        // Убрали .container, добавили класс .header-full для растягивания на весь экран
        headerEl.innerHTML = `
            <div class="header-inner header-full">
                <a href="#/" class="logo">Max<span>Energy</span></a>
                <a href="#/cart" class="cart-btn">
                    ${window.App.icons.cart}
                    <span class="cart-badge" id="cart-badge">0</span>
                </a>
            </div>
        `;

        // Первичная установка счетчика
        this.updateBadge(window.App.store.state);
    },

    // Реактивное обновление счетчика
    updateBadge(state) {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const total = window.App.store.getCartTotalItems();
            badge.textContent = total;
            // Скрываем бейдж, если пусто
            badge.style.display = total > 0 ? 'inline-block' : 'none';
        }
    },

    init() {
        this.render();
        // Подписываем шапку на изменения в Store
        window.App.store.subscribe((state) => this.updateBadge(state));
    }
};