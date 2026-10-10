window.App = window.App || {};
window.App.components = window.App.components || {};

window.App.components.ProductCard = (product) => {
    return `
        <div class="product-card">
            <span class="product-tag">${product.tag}</span>
            <a href="#/drink/${product.id}" class="product-image ${product.imageClass}">
                ${window.App.icons.bolt}
            </a>
            <a href="#/drink/${product.id}" class="product-name">${product.name}</a>
            <div class="product-footer">
                <span class="product-price">${product.price} ₽</span>
                <button class="btn-primary" data-action="add-to-cart" data-id="${product.id}">
                    В корзину
                </button>
            </div>
        </div>
    `;
};