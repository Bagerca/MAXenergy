window.App = window.App || {};

window.App.store = {
    state: { cart: [] },
    listeners: [],
    
    init() { this.loadFromStorage(); },
    subscribe(callback) { this.listeners.push(callback); },
    
    notify() {
        this.saveToStorage();
        this.listeners.forEach(callback => {
            try { callback(this.state); } catch (e) { console.error('[Store] Error:', e); }
        });
    },

    saveToStorage() {
        try {
            const miniCart = this.state.cart.map(item => ({ id: item.product.id, qty: item.quantity }));
            localStorage.setItem('maxenergy_cart', JSON.stringify(miniCart));
        } catch (e) { console.warn('LocalStorage is disabled', e); }
    },

    loadFromStorage() {
        try {
            const data = localStorage.getItem('maxenergy_cart');
            if (data) {
                const miniCart = JSON.parse(data);
                this.state.cart = miniCart.map(item => {
                    const product = window.App.catalog.find(p => p.id === item.id);
                    return product ? { product, quantity: item.qty } : null;
                }).filter(Boolean);
            }
        } catch (e) { console.warn('LocalStorage read error', e); }
    },

    addToCart(productId) {
        const product = window.App.catalog.find(p => p.id === productId);
        if (!product) return;
        const existingItem = this.state.cart.find(item => item.product.id === productId);
        if (existingItem) existingItem.quantity += 1;
        else this.state.cart.push({ product, quantity: 1 });
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
            if (item.quantity <= 0) this.removeFromCart(productId);
            else this.notify();
        }
    },

    getCartTotalItems() {
        return this.state.cart.reduce((total, item) => total + item.quantity, 0);
    },

    getCartTotalPrice() {
        return this.state.cart.reduce((total, item) => {
            // Если цена не число (например "Неизвестно"), приравниваем её к 0 для математики
            const price = typeof item.product.price === 'number' ? item.product.price : 0;
            return total + (price * item.quantity);
        }, 0);
    }
};

window.App.store.init();