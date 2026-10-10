window.App = window.App || {};
window.App.components = window.App.components || {};

window.App.components.ProductCard = (product) => {
    // Убираем значок "₽", если цена прописана словом
    const priceDisplay = typeof product.price === 'number' ? `${product.price} ₽` : product.price;

    return `
        <article class="product-card" style="--item-color: ${product.badgeColor}">
            <div class="product-header">
                <span class="product-tag">${product.tag}</span>
            </div>
            
            <a href="#/drink/${product.id}" class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </a>
            
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <a href="#/drink/${product.id}" class="product-name">${product.name}</a>
            </div>
            
            <div class="product-footer">
                <span class="product-price">${priceDisplay}</span>
                <button class="btn-primary" data-action="add-to-cart" data-id="${product.id}" aria-label="В корзину">
                    + В КОРЗИНУ
                </button>
            </div>
        </article>
    `;
};