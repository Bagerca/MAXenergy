window.App = window.App || {};
window.App.views = window.App.views || {};

window.App.views.CatalogView = {
    render(params, query) {
        const catalog = window.App.catalog;
        
        const html = `
            <div class="container">
                <section class="hero">
                    <h1>ЗАРЯДИСЬ ПЕРЕД ПАРАМИ</h1>
                    <p>Твой личный дилер энергии в СПК. Быстрая доставка от Макса прямо в руки.</p>
                </section>
                
                <section class="catalog-grid">
                    ${catalog.map(product => window.App.components.ProductCard(product)).join('')}
                </section>
            </div>
        `;

        const afterRender = () => {
            document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const product = window.App.catalog.find(p => p.id === id);
                    
                    window.App.store.addToCart(id);
                    // Вызываем глобальный Toast вместо порчи стилей кнопки
                    window.App.components.Toast.show(`${product.name} добавлен!`);
                });
            });
        };

        return { html, afterRender };
    }
};