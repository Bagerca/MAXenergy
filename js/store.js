window.App = window.App || {};

window.App.store = {
    state: {
        cart: [] // Формат: [{ product: Object, quantity: 1 }]
    },
    listeners: [],
    
    // Подписка на изменения
    subscribe(callback) {
        this.listeners.push(callback);
    },
    
    // Уведомление подписчиков
    notify() {
        console.log('[Store] State updated:', this.state);
        this.listeners.forEach(callback => {
            try {
                callback(this.state);
            } catch (e) {
                console.error('[Store] Listener error:', e);
            }
        });
    },

    // Действия (Actions)
    addToCart(productId) {
        const product = window.App.catalog.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.state.cart.find(item => item.product.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({ product, quantity: 1 });
        }
        this.notify();
    },

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.product.id !== productId);
        this.notify();
    },
    
    updateQuantity(productId, delta) {
        const item = this.state.cart.find(item => item.product.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.notify();
            }
        }
    },

    // Геттеры (Getters)
    getCartTotalItems() {
        return this.state.cart.reduce((total, item) => total + item.quantity, 0);
    },

    getCartTotalPrice() {
        return this.state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }
};