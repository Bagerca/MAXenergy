window.App = window.App || {};
window.App.views = window.App.views || {};

window.App.views.CatalogView = {
    render() {
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
            // Делегирование событий для кнопок "В корзину"
            document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    window.App.store.addToCart(id);
                    
                    // Микро-анимация кнопки
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Добавлено!';
                    e.target.style.backgroundColor = 'var(--accent-purple)';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.style.backgroundColor = '';
                    }, 1000);
                });
            });
        };

        return { html, afterRender };
    }
};