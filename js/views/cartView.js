window.App = window.App || {};
window.App.views = window.App.views || {};

window.App.views.CartView = {
    render() {
        const { cart } = window.App.store.state;
        const totalPrice = window.App.store.getCartTotalPrice();
        const totalItems = window.App.store.getCartTotalItems();
        
        let contentHtml = '';
        let hasUnknownPrices = false; // Флаг для чека

        if (cart.length === 0) {
            contentHtml = `
                <div class="cart-empty-card" style="padding: 4rem 2rem; text-align: center; background: var(--surface-color); border-radius: var(--radius-lg);">
                    <h2 style="font-size: 2rem; margin-bottom: 1rem;">Корзина пуста</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Выбери свой любимый вкус на главной.</p>
                    <a href="#/" class="btn-primary" style="display: inline-block;">К покупкам</a>
                </div>
            `;
        } else {
            const itemsHtml = cart.map(item => {
                const isKnown = typeof item.product.price === 'number';
                if (!isKnown) hasUnknownPrices = true;
                
                // Рендер цены для карточки товара в корзине
                const itemTotalDisplay = isKnown ? `${item.product.price * item.quantity} ₽` : 'Уточнить';
                const pricePerItemDisplay = isKnown ? `${item.product.price} ₽ / шт.` : item.product.price;

                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <a href="#/drink/${item.product.id}" class="cart-item-img-wrapper">
                                <img src="${item.product.image}" alt="${item.product.name}">
                            </a>
                            <div class="cart-item-details">
                                <a href="#/drink/${item.product.id}" class="cart-item-title">${item.product.name}</a>
                                <div class="cart-item-meta">
                                    <span>${item.product.volume}</span>
                                    <span>${pricePerItemDisplay}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cart-item-controls">
                            <div class="cart-item-price-block">
                                <div class="cart-item-total" style="${!isKnown ? 'font-size:1rem; color:var(--text-muted);' : ''}">${itemTotalDisplay}</div>
                            </div>
                            
                            <div class="qty-capsule">
                                <button class="qty-btn" data-action="minus" data-id="${item.product.id}">−</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" data-action="plus" data-id="${item.product.id}">+</button>
                            </div>
                            
                            <button class="btn-icon remove-btn" data-id="${item.product.id}" aria-label="Удалить">
                                ${window.App.icons.trash}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            // Финальный расчет чека
            let finalPriceDisplay = totalPrice > 0 ? `${totalPrice} ₽` : '0 ₽';
            if (hasUnknownPrices) {
                finalPriceDisplay += ' <span style="font-size:1rem; color:var(--text-muted); display:block; text-align:right;">+ уточнить</span>';
            }

            const tgMessage = this.generateOrderMessage(cart, totalPrice, hasUnknownPrices);
            const tgLink = `https://t.me/YaPonchick1487?text=${encodeURIComponent(tgMessage)}`;

            contentHtml = `
                <div class="cart-layout">
                    <div class="cart-list">${itemsHtml}</div>
                    
                    <aside class="cart-summary">
                        <div class="summary-title">Детали заказа</div>
                        <div class="summary-row"><span>Товаров</span><strong>${totalItems} шт.</strong></div>
                        <div class="summary-row"><span>Доставка</span><strong class="summary-free">В руки</strong></div>
                        <div class="summary-divider"></div>
                        <div class="summary-total" style="align-items: center;">
                            <span>Итого</span>
                            <div class="summary-total-price" style="text-align: right;">${finalPriceDisplay}</div>
                        </div>
                        <a href="${tgLink}" target="_blank" class="btn-tg">Заказать в Telegram</a>
                    </aside>
                </div>
            `;
        }

        const html = `
            <div class="cart-page-wrapper">
                <aside class="cart-sidebar"><a href="#/" class="back-link">${window.App.icons.back} Назад</a></aside>
                <div class="cart-content">${contentHtml}</div>
            </div>
        `;

        const afterRender = () => {
            document.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const action = e.currentTarget.getAttribute('data-action');
                    window.App.store.updateQuantity(id, action === 'plus' ? 1 : -1);
                    window.App.router.forceRerender();
                });
            });

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

    generateOrderMessage(cart, total, hasUnknownPrices) {
        let text = `Привет! Заказ (СПК):\n\n`;
        cart.forEach(item => {
            const isKnown = typeof item.product.price === 'number';
            const priceStr = isKnown ? `${item.product.price * item.quantity} ₽` : 'Цена уточняется';
            text += `⚡ ${item.product.name} — ${item.quantity} шт. (${priceStr})\n`;
        });
        
        let totalStr = total > 0 ? `${total} ₽` : '0 ₽';
        if (hasUnknownPrices) totalStr += ' + позиции без цены';
        
        text += `\n💰 Итого: ${totalStr}\nГде можно забрать?`;
        return text;
    }
};