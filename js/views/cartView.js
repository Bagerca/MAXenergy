window.App = window.App || {};
window.App.views = window.App.views || {};

window.App.views.CartView = {
    render() {
        const { cart } = window.App.store.state;
        const totalPrice = window.App.store.getCartTotalPrice();
        const totalItems = window.App.store.getCartTotalItems();
        
        let contentHtml = '';

        if (cart.length === 0) {
            contentHtml = `
                <div class="cart-empty-card">
                    <div class="cart-empty-icon">
                        ${window.App.icons.bolt}
                    </div>
                    <h2>В корзине пусто</h2>
                    <p>Сердечко пока в безопасности, но курсач сам себя не напишет.</p>
                    <a href="#/" class="btn-primary">Выбрать энергетик</a>
                </div>
            `;
        } else {
            const itemsHtml = cart.map(item => {
                const itemTotal = item.product.price * item.quantity;
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <a href="#/drink/${item.product.id}" class="cart-item-img ${item.product.imageClass}">
                                ${window.App.icons.bolt}
                            </a>
                            <div class="cart-item-details">
                                <a href="#/drink/${item.product.id}" class="cart-item-title">
                                    ${item.product.name}
                                </a>
                                <div class="cart-item-meta">
                                    <span class="cart-item-volume">${item.product.volume}</span>
                                    <span>${item.product.price} ₽ / шт.</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cart-item-controls">
                            <div class="cart-item-price-block">
                                <div class="cart-item-total">${itemTotal} ₽</div>
                            </div>
                            
                            <div class="qty-capsule">
                                <button class="qty-btn" data-action="minus" data-id="${item.product.id}">−</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" data-action="plus" data-id="${item.product.id}">+</button>
                            </div>
                            
                            <button class="btn-icon remove-btn" data-id="${item.product.id}" title="Удалить">
                                ${window.App.icons.trash}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            // Формируем сообщение для Telegram и подставляем реальный юзернейм
            const tgMessage = this.generateOrderMessage(cart, totalPrice);
            const tgLink = `https://t.me/YaPonchick1487?text=${encodeURIComponent(tgMessage)}`;

            contentHtml = `
                <div class="cart-layout">
                    <!-- Левая колонка: список товаров -->
                    <div class="cart-list">
                        ${itemsHtml}
                    </div>
                    
                    <!-- Правая колонка: чек и оформление -->
                    <aside class="cart-summary">
                        <div class="summary-title">Детали заказа</div>
                        
                        <div class="summary-row">
                            <span>Количество банок</span>
                            <strong>${totalItems} шт.</strong>
                        </div>
                        <div class="summary-row">
                            <span>Доставка (СПК 104к)</span>
                            <strong class="summary-free">В руки</strong>
                        </div>
                        
                        <div class="summary-divider"></div>
                        
                        <div class="summary-total">
                            <span>Итого</span>
                            <div class="summary-total-price">${totalPrice} ₽</div>
                        </div>
                        
                        <a href="${tgLink}" target="_blank" class="btn-tg">
                            ${window.App.icons.send} Заказать у Максима
                        </a>
                        <p class="summary-note">
                            Откроется личка в Telegram с уже готовым списком твоего заказа.
                        </p>
                    </aside>
                </div>
            `;
        }

        const html = `
            <div class="cart-page-wrapper">
                <aside class="cart-sidebar">
                    <a href="#/" class="back-link">
                        ${window.App.icons.back} Назад
                    </a>
                </aside>
                
                <div class="cart-content">
                    <h1 class="cart-page-title">Твой заказ</h1>
                    ${contentHtml}
                </div>
            </div>
        `;

        const afterRender = () => {
            // Обработчики кнопок количества (- / +)
            document.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const action = e.currentTarget.getAttribute('data-action');
                    window.App.store.updateQuantity(id, action === 'plus' ? 1 : -1);
                    window.App.router.forceRerender();
                });
            });

            // Обработчик удаления позиции
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    window.App.store.removeFromCart(id);
                    window.App.router.forceRerender();
                });
            });
        };

        return { html, afterRender };
    },

    generateOrderMessage(cart, total) {
        let text = `Привет, Макс! Я из СПК, хочу забрать:\n\n`;
        cart.forEach(item => {
            text += `⚡ ${item.product.name} (${item.product.volume}) — ${item.quantity} шт. (${item.product.price * item.quantity} ₽)\n`;
        });
        text += `\n💰 Итого: ${total} ₽\nГде и когда сможешь передать?`;
        return text;
    }
};