window.App = window.App || {};

document.addEventListener('DOMContentLoaded', () => {
    console.log('[App] Initialization started...');

    try {
        // 1. Инициализируем глобальные компоненты (Шапка)
        window.App.components.Header.init();

        // 2. Настраиваем маршруты Роутера
        // Главная: точное совпадение с '/' или пустая строка
        window.App.router.addRoute(/^\/$/, window.App.views.CatalogView);
        
        // Страница товара: ожидаем ID после /drink/
        window.App.router.addRoute(/^\/drink\/(?<id>[a-z0-9-]+)$/, window.App.views.DrinkView);
        
        // Корзина
        window.App.router.addRoute(/^\/cart$/, window.App.views.CartView);

        // 3. Запускаем Роутер
        window.App.router.init();
        
        console.log('[App] Successfully initialized.');
    } catch (error) {
        console.error('[App] Critical initialization error:', error);
    }
});