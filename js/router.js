window.App = window.App || {};

window.App.router = {
    routes: [],
    
    // Регистрация маршрутов с использованием Regex
    addRoute(pathRegex, viewComponent) {
        this.routes.push({ pathRegex, viewComponent });
    },

    // Логика перехода
    async navigate(hash) {
        console.log('[Router] Navigating to:', hash);
        
        // Очищаем хэш (например, '#/drink/123' -> '/drink/123')
        const path = hash === '' || hash === '#' ? '/' : hash.slice(1);
        
        let matchFound = false;
        
        for (const route of this.routes) {
            const match = path.match(route.pathRegex);
            if (match) {
                matchFound = true;
                
                // Извлекаем параметры (например, ID)
                const params = match.groups || {};
                
                try {
                    // Рендерим компонент
                    const { html, afterRender } = route.viewComponent.render(params);
                    const mainEl = document.getElementById('app-main');
                    
                    // Перезаписываем DOM
                    mainEl.innerHTML = html;
                    
                    // Перезапускаем анимацию
                    mainEl.classList.remove('fade-in');
                    void mainEl.offsetWidth; // Триггер рефлоу
                    mainEl.classList.add('fade-in');
                    
                    // Вешаем слушатели событий
                    if (afterRender) afterRender();
                    
                } catch (error) {
                    console.error('[Router] Render error:', error);
                }
                
                break;
            }
        }

        if (!matchFound) {
            console.warn('[Router] 404 - Route not found');
            document.getElementById('app-main').innerHTML = `
                <div class="container empty-state">
                    <h1>404</h1>
                    <p>Куда ты забрел, студент?</p>
                    <a href="#/" class="btn-outline">Домой</a>
                </div>
            `;
        }
    },

    // Метод для принудительной перерисовки текущего экрана (используется в корзине)
    forceRerender() {
        this.navigate(window.location.hash);
    },

    init() {
        // Слушаем изменение хэша (кнопки Назад/Вперед в браузере)
        window.addEventListener('hashchange', () => this.navigate(window.location.hash));
        
        // Первичная загрузка
        this.navigate(window.location.hash);
    }
};