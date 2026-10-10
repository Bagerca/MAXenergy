window.App = window.App || {};
window.App.views = window.App.views || {};

window.App.views.DrinkView = {
    render(params) {
        const productId = params.id;
        const product = window.App.catalog.find(p => p.id === productId);

        if (!product) {
            return {
                html: `
                    <div class="container empty-state">
                        <h1>404</h1>
                        <p>Энергетик не найден.</p>
                        <br>
                        <a href="#/" class="btn-outline">На главную</a>
                    </div>
                `,
                afterRender: null
            };
        }

        const html = `
            <div class="drink-page-wrapper">
                
                <aside class="drink-sidebar">
                    <a href="#/" class="back-link">
                        ${window.App.icons.back} Назад
                    </a>
                </aside>
                
                <article class="drink-details">
                    
                    <!-- Изображение строгих пропорций -->
                    <div class="drink-image-container ${product.imageClass}">
                        ${window.App.icons.bolt}
                    </div>
                    
                    <div class="drink-info">
                        
                        <!-- Заголовок самый главный -->
                        <h1 class="drink-title">${product.name}</h1>
                        
                        <!-- Цена и Тег на одной линии -->
                        <div class="drink-price-row">
                            <div class="drink-price">${product.price} ₽</div>
                            <span class="product-tag">${product.tag}</span>
                        </div>
                        
                        <!-- Горизонтальный дашборд: Характеристики (бейджи) -->
                        <div class="drink-meta-row">
                            <div class="spec-badge">
                                <strong>ОБЪЕМ</strong> ${product.volume}
                            </div>
                            <div class="spec-badge">
                                <strong>КОФЕИН</strong> ~30 мг
                            </div>
                            <div class="spec-badge">
                                <strong>ТАУРИН</strong> Да
                            </div>
                        </div>
                        
                        <!-- Описание -->
                        <p class="drink-desc">${product.desc}</p>
                        
                        <!-- Экшен -->
                        <div class="drink-actions">
                            <button class="btn-primary" id="detail-add-btn">
                                ДОБАВИТЬ В КОРЗИНУ
                            </button>
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
                    
                    const originalText = btn.textContent;
                    btn.textContent = 'В КОРЗИНЕ!';
                    btn.style.backgroundColor = 'var(--accent-purple)';
                    btn.style.color = '#ffffff';
                    btn.style.boxShadow = '0 0 30px rgba(192, 38, 211, 0.6)';
                    btn.style.transform = 'scale(0.98)';
                    
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                    }, 150);
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                        btn.style.boxShadow = '';
                    }, 1500);
                });
            }
        };

        return { html, afterRender };
    }
};