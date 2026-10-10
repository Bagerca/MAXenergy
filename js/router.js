window.App = window.App || {};

window.App.router = {
    routes: [],
    
    addRoute(pathRegex, viewComponent) {
        this.routes.push({ pathRegex, viewComponent });
    },

    async navigate(hash) {
        console.log('[Router] Navigating to:', hash);
        
        // Разделяем путь и query параметры (например: #/catalog?sort=price)
        const [hashPath, queryString] = hash.split('?');
        const path = hashPath === '' || hashPath === '#' ? '/' : hashPath.slice(1);
        
        // Парсим Query
        const searchParams = new URLSearchParams(queryString || '');
        const query = Object.fromEntries(searchParams.entries());
        
        let matchFound = false;
        
        for (const route of this.routes) {
            const match = path.match(route.pathRegex);
            if (match) {
                matchFound = true;
                const params = match.groups || {};
                
                try {
                    // Передаем и параметры пути, и query
                    const { html, afterRender } = route.viewComponent.render(params, query);
                    const mainEl = document.getElementById('app-main');
                    
                    mainEl.innerHTML = html;
                    
                    mainEl.classList.remove('fade-in');
                    void mainEl.offsetWidth; 
                    mainEl.classList.add('fade-in');
                    
                    if (afterRender) afterRender();
                } catch (error) {
                    console.error('[Router] Render error:', error);
                }
                break;
            }
        }

        if (!matchFound) {
            document.getElementById('app-main').innerHTML = `
                <div class="container empty-state">
                    <h1>404</h1>
                    <p>Такой страницы не существует.</p>
                    <a href="#/" class="btn-outline" style="margin-top: 1rem; display: inline-block;">На главную</a>
                </div>
            `;
        }
    },

    forceRerender() {
        this.navigate(window.location.hash);
    },

    init() {
        window.addEventListener('hashchange', () => this.navigate(window.location.hash));
        this.navigate(window.location.hash);
    }
};