window.App = window.App || {};
window.App.views = window.App.views || {};

window.App.views.DrinkView = {
    render(params) {
        const productId = params.id;
        const product = window.App.catalog.find(p => p.id === productId);

        if (!product) {
            return { html: `<div class="container empty-state"><h1>404</h1><p>Товар не найден.</p></div>`, afterRender: null };
        }

        const specLabels = {
            volume: 'Объем', weight: 'Вес', calories: 'Энерг. ценность',
            caffeine: 'Кофеин', taurine: 'Таурин', proteins: 'Белки',
            fats: 'Жиры', carbs: 'Углеводы', shelfLife: 'Срок хранения'
        };

        const specsHtml = Object.entries(product.specs || {}).map(([key, val]) => `
            <div class="spec-item"><span class="spec-label">${specLabels[key] || key}</span><span class="spec-value">${val}</span></div>
        `).join('');

        // Если цена текст - выводим как есть, иначе добавляем ₽
        const priceDisplay = typeof product.price === 'number' ? `${product.price} ₽` : product.price;

        const html = `
            <div class="drink-page-wrapper">
                <aside class="drink-sidebar"><a href="#/" class="back-link">${window.App.icons.back} Назад</a></aside>
                
                <article class="drink-details" style="--item-color: ${product.badgeColor}">
                    <div class="drink-image-container"><img src="${product.image}" alt="${product.name}"></div>
                    
                    <div class="drink-info">
                        <div class="drink-brand">${product.brand}</div>
                        <h1 class="drink-title">${product.name}</h1>
                        
                        <div class="drink-price-row">
                            <div class="drink-price">${priceDisplay}</div>
                            <span class="product-tag" style="border: 1px solid var(--item-color); padding: 6px 12px; border-radius: 6px; color: var(--item-color); font-weight: 900; font-size: 0.9rem;">
                                ${product.tag}
                            </span>
                        </div>
                        
                        <p class="drink-desc">${product.desc}</p>
                        <div class="specs-grid">${specsHtml}</div>
                        <div class="composition-text"><strong>Состав:</strong> ${product.composition}</div>
                        
                        <div class="drink-actions">
                            <button class="btn-primary" id="detail-add-btn">ДОБАВИТЬ В КОРЗИНУ</button>
                        </div>
                    </div>
                </article>
            </div>
        `;

        const afterRender = () => {
            const btn = document.getElementById('detail-add-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    window.App.store.addToCart(product.id);
                    window.App.components.Toast.show(`${product.name} добавлен в корзину!`);
                });
            }
        };

        return { html, afterRender };
    }
};